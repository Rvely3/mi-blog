import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { writeClient } from '@/sanity/lib/writeClient'
import { markdownToPortableText } from '@/lib/markdown/markedToPortableText'

/**
 * POST /api/ingest-post
 *
 * Endpoint "Técnico": recibe una señal mínima de Make (el Responsable)
 * avisando que hay un nuevo expediente en Airtable (el Almacén), y se
 * encarga de TODO el trabajo técnico:
 *
 *   Make → POST { recordId } → Script
 *     1. Script valida auth del llamado.
 *     2. Script lee el expediente directo de Airtable.
 *     3. Script valida que `Estado` === "Listo_para_publicar" ANTES de
 *        gastar compute (defensa en profundidad: no confía ciegamente
 *        en el filtro de Make).
 *     4. Script valida campos obligatorios.
 *     5. Script deriva / sanea el slug y chequea unicidad en Sanity.
 *     6. Script convierte el Contenido (markdown) a Portable Text,
 *        subiendo imágenes inline como assets de Sanity.
 *     7. Script crea el documento `post` en Sanity.
 *     8. Script responde a Make con stats del trabajo realizado.
 *
 *   El Script NUNCA toca el `Estado` del expediente en Airtable.
 *   Esa responsabilidad es de Make, que la ejerce DESPUÉS de verificar
 *   por su cuenta que el post efectivamente exista en Sanity.
 *
 * Seguridad:
 *   - Header `Authorization: Bearer <INGEST_API_SECRET>` con comparación
 *     en tiempo constante.
 *   - Body mínimo (solo `recordId`), sin superficie de ataque vía payload.
 *
 * Errores:
 *   - 400 → body inválido.
 *   - 401 → token inválido o ausente.
 *   - 404 → el recordId no existe en Airtable, o Airtable rechaza el ID
 *           como no-reconocible (INVALID_REQUEST). Ambos casos se tratan
 *           igual: no hay expediente para procesar, Make no debe reintentar.
 *   - 409 → ya existe un post en Sanity con ese slug.
 *   - 422 → el expediente existe pero no está listo para publicar o
 *           le faltan campos obligatorios.
 *   - 500 → fallo de red/Sanity/configuración.
 *   - 502 → Airtable respondió con error no recuperable.
 *   - 503 → Airtable rate-limiteó (429); incluye `Retry-After` para que
 *           Make haga backoff automático.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ── Config ──

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0'
const AIRTABLE_TABLE_DEFAULT = 'Artículos'

// Solo se publica cuando el expediente está en este estado.
const ESTADO_APROBADO = 'Listo_para_publicar'

// Mapping explícito: nombre en Airtable → clave interna.
// Si mañana renombrás un campo en Airtable, solo tocás esta tabla.
// Para agregar un campo nuevo (ej. Extracto, Autor, Portada): añadir entrada
// aquí + añadirlo al AirtableFieldsSchema + leerlo al armar el doc Sanity.
const AIRTABLE_FIELDS = {
  title: 'Título',
  slug: 'Slug',
  content: 'Contenido',
  publishedAt: 'Fecha de publicación',
  // 'Tema' se lee pero aún no se mapea a Sanity `categorias`;
  // se sumará cuando definamos la tabla label → slug.
  tema: 'Tema',
  // 'Estado' se lee para validar que el expediente esté aprobado.
  estado: 'Estado',
} as const

// ── Schemas ──

const RequestSchema = z.object({
  recordId: z
    .string()
    .trim()
    .regex(/^rec[A-Za-z0-9]{14}$/, 'recordId con formato Airtable inválido'),
})

// Lo que esperamos encontrar dentro de `fields` del record de Airtable.
// Todo opcional a nivel de tipo porque Airtable omite campos vacíos;
// la obligatoriedad la validamos nosotros más adelante (422 si falta).
const AirtableFieldsSchema = z
  .object({
    [AIRTABLE_FIELDS.title]: z.string().trim().min(1).optional(),
    [AIRTABLE_FIELDS.slug]: z.string().trim().optional(),
    [AIRTABLE_FIELDS.content]: z.string().min(1).optional(),
    [AIRTABLE_FIELDS.publishedAt]: z.string().optional(),
    [AIRTABLE_FIELDS.tema]: z.string().optional(),
    [AIRTABLE_FIELDS.estado]: z.string().optional(),
  })
  .passthrough()

// ── Handler ──

export async function POST(req: NextRequest) {
  // 1. Auth
  const authError = checkAuth(req)
  if (authError) return authError

  // 2. Parse body (mínimo: solo recordId)
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return json({ error: 'JSON inválido' }, 400)
  }

  const parsed = RequestSchema.safeParse(raw)
  if (!parsed.success) {
    return json(
      {
        error: 'Payload inválido',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      400,
    )
  }
  const { recordId } = parsed.data

  // 3. Leer del Almacén (Airtable)
  const envOrError = getAirtableEnv()
  if ('error' in envOrError) return envOrError.error
  const env = envOrError

  let record: { id: string; fields: Record<string, unknown> }
  try {
    record = await fetchAirtableRecord(recordId, env)
  } catch (err) {
    return handleAirtableError(err, recordId)
  }

  const fieldsParsed = AirtableFieldsSchema.safeParse(record.fields)
  if (!fieldsParsed.success) {
    return json(
      {
        error: 'El expediente tiene campos con formato inesperado',
        recordId,
        issues: fieldsParsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      422,
    )
  }
  const fields = fieldsParsed.data

  // 4. Validar Estado ANTES de trabajo costoso (conversión + subida de
  //    imágenes). Si el expediente no está aprobado, cortamos acá.
  const estado = fields[AIRTABLE_FIELDS.estado]
  if (estado !== ESTADO_APROBADO) {
    return json(
      {
        error: 'Expediente no aprobado para publicar',
        recordId,
        estado: estado ?? null,
        expected: ESTADO_APROBADO,
      },
      422,
    )
  }

  // 5. Validar campos obligatorios
  //    El shape `if (!title || !markdown)` permite que TypeScript haga
  //    narrowing y, tras este bloque, trate ambas variables como `string`
  //    (no `string | undefined`).
  const title = fields[AIRTABLE_FIELDS.title]
  const markdown = fields[AIRTABLE_FIELDS.content]
  if (!title || !markdown) {
    const missing: string[] = []
    if (!title) missing.push(AIRTABLE_FIELDS.title)
    if (!markdown) missing.push(AIRTABLE_FIELDS.content)
    return json(
      {
        error: 'El expediente está incompleto',
        recordId,
        missing,
      },
      422,
    )
  }

  // 6. Derivar slug y chequear unicidad en Sanity
  const rawSlug = fields[AIRTABLE_FIELDS.slug]
  const slug = rawSlug ? normalizeSlug(rawSlug) : slugify(title)
  if (!slug) {
    return json(
      { error: 'No se pudo derivar un slug válido desde el Título', recordId },
      422,
    )
  }

  try {
    const exists = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "post" && slug.current == $slug][0]{ _id }`,
      { slug },
    )
    if (exists) {
      return json(
        {
          error: 'Ya existe un post con ese slug',
          slug,
          existingId: exists._id,
          recordId,
        },
        409,
      )
    }
  } catch (err) {
    console.error('[ingest-post] slug check failed:', toSafeError(err))
    return json({ error: 'No se pudo verificar el slug' }, 500)
  }

  // 7. Convertir markdown → Portable Text
  const warnings: string[] = []
  let conversion
  try {
    conversion = await markdownToPortableText(markdown)
  } catch (err) {
    console.error('[ingest-post] conversion failed:', toSafeError(err))
    return json(
      {
        error: 'Falló la conversión del markdown',
        detail: (err as Error).message,
      },
      500,
    )
  }
  warnings.push(...conversion.warnings)

  // 8. Armar documento Sanity
  //    Nota: Airtable devuelve `Fecha de publicación` como ISO 8601 con
  //    offset UTC vía API. `new Date(iso).toISOString()` preserva el
  //    instante absoluto correctamente, independientemente de que en la
  //    UI de Airtable se vea en America/Lima.
  const publishedAt =
    normalizeDate(fields[AIRTABLE_FIELDS.publishedAt]) ||
    new Date().toISOString()

  const doc: { _type: 'post' } & Record<string, unknown> = {
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug },
    content: conversion.blocks,
    publishedAt,
  }

  // 9. Crear en Sanity
  let created: { _id: string }
  try {
    created = await writeClient.create(doc)
  } catch (err) {
    console.error('[ingest-post] sanity create failed:', toSafeError(err))
    return json(
      {
        error: 'No se pudo crear el post en Sanity',
        detail: (err as Error).message,
      },
      500,
    )
  }

  // 10. Reportar al Responsable (Make)
  //     OJO: el Script NO modifica el Estado en Airtable.
  return json(
    {
      ok: true,
      recordId,
      _id: created._id,
      slug,
      stats: {
        blocks: conversion.blocks.length,
        imagesUploaded: conversion.uploadedImages.length,
        warnings: warnings.length,
      },
      warnings,
    },
    201,
  )
}

export async function GET() {
  return json({ error: 'Method Not Allowed. Usa POST.' }, 405)
}

// ── Airtable ──

type AirtableEnv = {
  pat: string
  baseId: string
  tableName: string
}

function getAirtableEnv(): AirtableEnv | { error: NextResponse } {
  const pat = process.env.AIRTABLE_PAT
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableName = process.env.AIRTABLE_TABLE_NAME || AIRTABLE_TABLE_DEFAULT

  if (!pat || !baseId) {
    const missing: string[] = []
    if (!pat) missing.push('AIRTABLE_PAT')
    if (!baseId) missing.push('AIRTABLE_BASE_ID')
    console.error('[ingest-post] faltan env vars:', missing.join(', '))
    return {
      error: json({ error: 'Endpoint no configurado (Airtable)' }, 500),
    }
  }

  // Type narrowing por control flow: pat y baseId aquí ya son `string`.
  return { pat, baseId, tableName }
}

/**
 * Error tipado para diferenciar motivos de falla contra Airtable y que
 * el caller pueda traducirlos a distintos códigos HTTP.
 */
class AirtableError extends Error {
  constructor(
    message: string,
    public readonly kind:
      | 'not_found'
      | 'invalid_request'
      | 'rate_limit'
      | 'other',
    public readonly status?: number,
    public readonly retryAfter?: number,
  ) {
    super(message)
    this.name = 'AirtableError'
  }
}

async function fetchAirtableRecord(
  recordId: string,
  env: AirtableEnv,
): Promise<{ id: string; fields: Record<string, unknown> }> {
  const url = `${AIRTABLE_API_BASE}/${env.baseId}/${encodeURIComponent(
    env.tableName,
  )}/${recordId}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${env.pat}` },
    // Siempre queremos la versión fresca del expediente.
    cache: 'no-store',
  })

  if (res.status === 404) {
    throw new AirtableError('NOT_FOUND', 'not_found', 404)
  }

  if (res.status === 422) {
    // Airtable devuelve 422 INVALID_REQUEST cuando el recordId no es
    // reconocible como ID (distinto de "existía y fue borrado", que es 404).
    // Para Make el resultado práctico es el mismo: no hay expediente
    // para procesar. Lo unificamos con not_found al traducirlo.
    const body = await res.text().catch(() => '')
    throw new AirtableError(
      `INVALID_REQUEST: ${body.slice(0, 300)}`,
      'invalid_request',
      422,
    )
  }

  if (res.status === 429) {
    const retryAfter = parseRetryAfter(res.headers.get('retry-after'))
    throw new AirtableError(
      'Airtable rate limited (429)',
      'rate_limit',
      429,
      retryAfter,
    )
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new AirtableError(
      `Airtable ${res.status}: ${body.slice(0, 300)}`,
      'other',
      res.status,
    )
  }

  const data = (await res.json()) as {
    id: string
    fields: Record<string, unknown>
  }
  return data
}

function handleAirtableError(err: unknown, recordId: string): NextResponse {
  if (err instanceof AirtableError) {
    if (err.kind === 'not_found' || err.kind === 'invalid_request') {
      // Unificamos: desde afuera, "no existe" e "ID irreconocible" son
      // indistinguibles operacionalmente — no hay expediente que procesar.
      // Un 404 en vez de 502 evita que Make reintente en vano.
      return json(
        {
          error: 'Expediente no encontrado o recordId no válido',
          recordId,
          ...(err.kind === 'invalid_request' && { detail: err.message }),
        },
        404,
      )
    }
    if (err.kind === 'rate_limit') {
      // Traducimos 429 de Airtable → 503 + Retry-After para que Make
      // (u otro cliente HTTP bien educado) haga backoff automático en
      // lugar de quemar reintentos agresivos.
      const retry = err.retryAfter ?? 30
      const res = json(
        {
          error: 'Almacén temporalmente no disponible',
          recordId,
          retryAfter: retry,
        },
        503,
      )
      res.headers.set('Retry-After', String(retry))
      return res
    }
    console.error('[ingest-post] airtable fetch failed:', err.message)
    return json(
      { error: 'No se pudo leer Airtable', detail: err.message, recordId },
      502,
    )
  }
  console.error('[ingest-post] airtable fetch failed:', toSafeError(err))
  return json({ error: 'No se pudo leer Airtable', recordId }, 502)
}

/**
 * Parsea el header `Retry-After`. Acepta tanto delta-seconds ("30") como
 * HTTP-date ("Wed, 21 Oct 2026 07:28:00 GMT") según RFC 7231 §7.1.3.
 */
function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined

  const secs = Number(header)
  if (Number.isFinite(secs) && secs >= 0) return Math.ceil(secs)

  const date = Date.parse(header)
  if (!Number.isNaN(date)) {
    const delta = Math.ceil((date - Date.now()) / 1000)
    return delta > 0 ? delta : 0
  }
  return undefined
}

// ── Auth ──

function checkAuth(req: NextRequest): NextResponse | null {
  const expected = process.env.INGEST_API_SECRET
  if (!expected) {
    console.error('[ingest-post] INGEST_API_SECRET no está configurado')
    return json({ error: 'Endpoint no configurado' }, 500)
  }

  const header = req.headers.get('authorization') || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[ingest-post] auth fail: header Authorization ausente o malformado (recibido: ${
          header ? `"${header.slice(0, 20)}..."` : '(vacío)'
        })`,
      )
    }
    return json({ error: 'Falta Authorization: Bearer' }, 401)
  }

  const provided = match[1].trim()
  if (!safeEqual(provided, expected)) {
    if (process.env.NODE_ENV !== 'production') {
      // Log dev-only: longitudes + primer/último char para detectar
      // comillas, whitespace o BOM en .env.local sin volcar el secreto.
      const sample = (s: string) =>
        s.length <= 6
          ? '*'.repeat(s.length)
          : `${s.slice(0, 3)}…${s.slice(-3)}`
      console.warn(
        `[ingest-post] auth fail: token mismatch. ` +
          `expected len=${expected.length} sample=${sample(expected)}, ` +
          `provided len=${provided.length} sample=${sample(provided)}`,
      )
    }
    return json({ error: 'Token inválido' }, 401)
  }

  return null
}

function safeEqual(a: string, b: string): boolean {
  // `timingSafeEqual` requiere buffers de igual longitud; si no coinciden,
  // devolvemos false pero igual comparamos contra una copia para no
  // filtrar la longitud por diferencia de tiempos.
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf)
    return false
  }
  return timingSafeEqual(aBuf, bBuf)
}

// ── Utils ──

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96)
}

function normalizeSlug(input: string): string {
  // Si el humano metió el slug con mayúsculas, espacios o acentos,
  // lo saneamos igual. Si queda vacío, devolvemos string vacío
  // y el caller decide (fallback a slugify(title)).
  return slugify(input)
}

function normalizeDate(input: unknown): string | null {
  if (typeof input !== 'string' || !input.trim()) return null
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function json(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, { status })
}

function toSafeError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`
  return String(err)
}
