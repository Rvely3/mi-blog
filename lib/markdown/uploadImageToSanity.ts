import 'server-only'
import { writeClient } from '@/sanity/lib/writeClient'

/**
 * Descarga una imagen desde una URL pública y la sube a Sanity como asset.
 *
 * Devuelve el `_id` del asset (ej. `image-abc123-1024x768-jpg`) listo para
 * referenciar desde un bloque portable text:
 *
 *   { _type: 'image', asset: { _type: 'reference', _ref: id } }
 *
 * Consideraciones:
 *   - Limita el tamaño a MAX_BYTES para no colgar el proceso con archivos
 *     enormes ni exponernos a denial-of-service.
 *   - Valida que el content-type comience con `image/`.
 *   - Respeta un timeout para evitar que un host lento bloquee el endpoint.
 */

const MAX_BYTES = 15 * 1024 * 1024 // 15 MB
const FETCH_TIMEOUT_MS = 15_000
const ALLOWED_MIME = /^image\//i

export interface UploadedImage {
  assetId: string
  url?: string
  originalUrl: string
  filename: string
  mime?: string
}

export async function uploadImageFromUrl(
  rawUrl: string,
): Promise<UploadedImage> {
  const url = safeUrl(rawUrl)
  if (!url) throw new Error(`URL de imagen inválida: ${rawUrl}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'terrenosentrujillo.pe/ingest' },
    })
  } catch (err) {
    throw new Error(
      `No se pudo descargar la imagen (${url.host}): ${
        (err as Error).message
      }`,
    )
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    throw new Error(
      `La URL de imagen respondió ${res.status} ${res.statusText}`,
    )
  }

  const mime = res.headers.get('content-type')?.split(';')[0]?.trim() || ''
  if (!ALLOWED_MIME.test(mime)) {
    throw new Error(`El content-type no es imagen: "${mime || 'desconocido'}"`)
  }

  const lenHeader = Number(res.headers.get('content-length') || 0)
  if (lenHeader && lenHeader > MAX_BYTES) {
    throw new Error(
      `La imagen excede el tamaño máximo (${formatBytes(
        lenHeader,
      )} > ${formatBytes(MAX_BYTES)})`,
    )
  }

  const arrayBuf = await res.arrayBuffer()
  if (arrayBuf.byteLength > MAX_BYTES) {
    throw new Error(
      `La imagen excede el tamaño máximo (${formatBytes(
        arrayBuf.byteLength,
      )} > ${formatBytes(MAX_BYTES)})`,
    )
  }

  const buffer = Buffer.from(arrayBuf)
  const filename = extractFilename(url, mime)

  const asset = await writeClient.assets.upload('image', buffer, {
    filename,
    contentType: mime,
  })

  return {
    assetId: asset._id,
    url: asset.url,
    originalUrl: url.toString(),
    filename,
    mime,
  }
}

function safeUrl(raw: string): URL | null {
  try {
    const u = new URL(raw)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return u
  } catch {
    return null
  }
}

function extractFilename(url: URL, mime: string): string {
  const fromPath = url.pathname.split('/').pop() || ''
  if (fromPath && /\.[a-z0-9]{2,5}$/i.test(fromPath)) return fromPath
  const ext = mimeToExt(mime) || 'jpg'
  return `image-${Date.now()}.${ext}`
}

function mimeToExt(mime: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/svg+xml': 'svg',
  }
  return map[mime.toLowerCase()] || null
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 ** 2).toFixed(1)} MB`
}
