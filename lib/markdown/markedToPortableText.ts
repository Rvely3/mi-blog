import 'server-only'
import { marked, type Tokens, type TokensList } from 'marked'
import { randomUUID } from 'node:crypto'
import { uploadImageFromUrl, type UploadedImage } from './uploadImageToSanity'

/**
 * Convierte markdown a Portable Text (array de bloques de Sanity),
 * incluyendo:
 *   - Encabezados h1..h4 (h5/h6 se degradan a h4 — los estilos por defecto
 *     de `{ type: 'block' }` llegan hasta h4 / blockquote / normal).
 *   - Párrafos con marks inline: strong, em, code, links.
 *   - Listas ordenadas y no ordenadas (un nivel; las anidadas se aplanan
 *     con `level`).
 *   - Blockquotes.
 *   - Code blocks (como párrafo con mark `code` al texto entero).
 *   - Imágenes `![alt](url)` — se descargan, suben a Sanity como asset,
 *     y se emiten como bloque `{ _type: 'image', asset: { _ref } }`
 *     EXACTAMENTE en la posición donde aparecían en el markdown.
 *
 * Las imágenes que fallan al subir NO rompen la conversión: se registran
 * en `warnings` y se reemplazan por un párrafo con un enlace al URL
 * original — así el contenido textual queda completo aunque falle el CDN.
 */

// Types mínimos para los bloques que emitimos. Sanity acepta estos shapes
// en campos `{ type: 'block' }` y `{ type: 'image' }`.
interface Span {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface MarkDef {
  _key: string
  _type: 'link'
  href: string
}

export interface Block {
  _type: 'block'
  _key: string
  style: string
  children: Span[]
  markDefs: MarkDef[]
  listItem?: 'bullet' | 'number'
  level?: number
}

export interface ImageBlock {
  _type: 'image'
  _key: string
  asset: { _type: 'reference'; _ref: string }
  alt?: string
}

export type PortableBlock = Block | ImageBlock

export interface ConversionResult {
  blocks: PortableBlock[]
  uploadedImages: UploadedImage[]
  warnings: string[]
}

export async function markdownToPortableText(
  markdown: string,
): Promise<ConversionResult> {
  const tokens = marked.lexer(markdown) as TokensList
  const blocks: PortableBlock[] = []
  const uploadedImages: UploadedImage[] = []
  const warnings: string[] = []

  for (const token of tokens) {
    await visitToken(token, blocks, uploadedImages, warnings, 1)
  }

  return { blocks, uploadedImages, warnings }
}

async function visitToken(
  token: Tokens.Generic,
  out: PortableBlock[],
  uploads: UploadedImage[],
  warnings: string[],
  level: number,
): Promise<void> {
  switch (token.type) {
    case 'space':
      return

    case 'hr':
      // Portable Text no tiene hr nativo con el schema actual;
      // emitimos un párrafo con separador visual.
      out.push(plainBlock('normal', '—'))
      return

    case 'heading': {
      const h = token as Tokens.Heading
      out.push({
        _type: 'block',
        _key: mkKey(),
        style: headingStyle(h.depth),
        children: renderInline(h.tokens || [{ type: 'text', raw: h.text, text: h.text }]).spans,
        markDefs: renderInline(h.tokens || []).markDefs,
      })
      return
    }

    case 'paragraph': {
      const p = token as Tokens.Paragraph
      // Un párrafo que solo contiene una imagen → emitir imageBlock en
      // lugar del párrafo. Si tiene texto + imagen mezclados, extraemos
      // las imágenes a bloques propios y el resto queda como párrafo.
      const imageTokens: Tokens.Image[] = []
      const textTokens: Tokens.Generic[] = []
      for (const t of p.tokens || []) {
        if (t.type === 'image') imageTokens.push(t as Tokens.Image)
        else textTokens.push(t)
      }

      if (imageTokens.length && textTokens.every(isWhitespaceToken)) {
        for (const img of imageTokens) {
          await emitImageBlock(img, out, uploads, warnings)
        }
        return
      }

      const { spans, markDefs } = renderInline(p.tokens || [])
      if (spans.length === 0) return
      out.push({
        _type: 'block',
        _key: mkKey(),
        style: 'normal',
        children: spans,
        markDefs,
      })
      // Si había imágenes mezcladas con texto, las sacamos como bloques
      // aparte después del párrafo.
      for (const img of imageTokens) {
        await emitImageBlock(img, out, uploads, warnings)
      }
      return
    }

    case 'blockquote': {
      const bq = token as Tokens.Blockquote
      // Concatenamos el texto plano del blockquote en un solo bloque
      // estilo 'blockquote'. Si el blockquote trae varios párrafos, los
      // unimos con saltos de línea (el renderer los respeta).
      const textParts: string[] = []
      for (const inner of bq.tokens || []) {
        if (inner.type === 'paragraph') {
          const p = inner as Tokens.Paragraph
          textParts.push(renderInline(p.tokens || []).spans.map(s => s.text).join(''))
        } else if ('text' in inner && typeof inner.text === 'string') {
          textParts.push(inner.text)
        }
      }
      out.push(plainBlock('blockquote', textParts.join('\n\n').trim()))
      return
    }

    case 'list': {
      const list = token as Tokens.List
      const listItem = list.ordered ? 'number' : 'bullet'
      for (const item of list.items) {
        // Extraemos el texto visible del item y cualquier sublista.
        const { itemSpans, itemMarkDefs, nestedLists } = splitListItem(item)
        if (itemSpans.length > 0) {
          out.push({
            _type: 'block',
            _key: mkKey(),
            style: 'normal',
            listItem,
            level,
            children: itemSpans,
            markDefs: itemMarkDefs,
          })
        }
        for (const nested of nestedLists) {
          await visitToken(nested, out, uploads, warnings, level + 1)
        }
      }
      return
    }

    case 'code': {
      const c = token as Tokens.Code
      // Bloque de código como párrafo con mark `code` a todo el texto.
      // Preservamos saltos de línea.
      const span: Span = {
        _type: 'span',
        _key: mkKey(),
        text: c.text,
        marks: ['code'],
      }
      out.push({
        _type: 'block',
        _key: mkKey(),
        style: 'normal',
        children: [span],
        markDefs: [],
      })
      return
    }

    case 'html':
      // HTML crudo no se mapea bien; emitimos texto plano como párrafo
      // y lo dejamos registrado en warnings para que el editor lo revise.
      warnings.push('Se encontró HTML embebido en el markdown; se convirtió a texto plano.')
      out.push(plainBlock('normal', (token as Tokens.HTML).text))
      return

    case 'table':
      // Portable Text sin un type custom `table` no puede representar
      // tablas; lo reportamos.
      warnings.push('Se encontró una tabla en el markdown; este schema aún no soporta tablas y se omitió.')
      return

    default:
      // Tokens no manejados (def, footnote, escape, etc.): si tienen
      // `text`, los emitimos como párrafo; si no, los ignoramos.
      if ('text' in token && typeof token.text === 'string' && token.text.trim()) {
        out.push(plainBlock('normal', token.text))
      }
      return
  }
}

function splitListItem(item: Tokens.ListItem): {
  itemSpans: Span[]
  itemMarkDefs: MarkDef[]
  nestedLists: Tokens.Generic[]
} {
  const inlineTokens: Tokens.Generic[] = []
  const nestedLists: Tokens.Generic[] = []

  for (const t of item.tokens || []) {
    if (t.type === 'list') {
      nestedLists.push(t)
    } else if (t.type === 'text') {
      const tt = t as Tokens.Text
      // marked anida los tokens inline dentro de `.tokens` del token text.
      inlineTokens.push(...(tt.tokens || [{ type: 'text', raw: tt.text, text: tt.text } as Tokens.Generic]))
    } else if (t.type === 'paragraph') {
      const p = t as Tokens.Paragraph
      inlineTokens.push(...(p.tokens || []))
    } else {
      inlineTokens.push(t)
    }
  }

  const { spans, markDefs } = renderInline(inlineTokens)
  return { itemSpans: spans, itemMarkDefs: markDefs, nestedLists }
}

function renderInline(tokens: Tokens.Generic[]): {
  spans: Span[]
  markDefs: MarkDef[]
} {
  const spans: Span[] = []
  const markDefs: MarkDef[] = []

  const walk = (toks: Tokens.Generic[], activeMarks: string[]): void => {
    for (const t of toks) {
      switch (t.type) {
        case 'text': {
          const tt = t as Tokens.Text
          if (tt.tokens && tt.tokens.length > 0) {
            walk(tt.tokens, activeMarks)
          } else {
            pushText(spans, decodeEntities(tt.text), activeMarks)
          }
          break
        }
        case 'strong':
          walk((t as Tokens.Strong).tokens || [], [...activeMarks, 'strong'])
          break
        case 'em':
          walk((t as Tokens.Em).tokens || [], [...activeMarks, 'em'])
          break
        case 'del':
          walk((t as Tokens.Del).tokens || [], [...activeMarks, 'strike-through'])
          break
        case 'codespan':
          pushText(
            spans,
            decodeEntities((t as Tokens.Codespan).text),
            [...activeMarks, 'code'],
          )
          break
        case 'link': {
          const lk = t as Tokens.Link
          const key = mkKey()
          markDefs.push({ _key: key, _type: 'link', href: lk.href })
          walk(lk.tokens || [{ type: 'text', raw: lk.text, text: lk.text } as Tokens.Generic], [
            ...activeMarks,
            key,
          ])
          break
        }
        case 'br':
          pushText(spans, '\n', activeMarks)
          break
        case 'escape':
          pushText(spans, (t as Tokens.Escape).text, activeMarks)
          break
        case 'image':
          // Imagen inline dentro de un span: la ignoramos aquí; el caller
          // (visitToken paragraph) se encarga de extraer imágenes a
          // bloques propios. Dejamos el alt como fallback textual.
          if ((t as Tokens.Image).text) {
            pushText(spans, (t as Tokens.Image).text, activeMarks)
          }
          break
        default:
          if ('text' in t && typeof t.text === 'string') {
            pushText(spans, t.text, activeMarks)
          }
      }
    }
  }

  walk(tokens, [])
  return { spans, markDefs }
}

function pushText(spans: Span[], text: string, marks: string[]): void {
  if (!text) return
  const last = spans[spans.length - 1]
  // Fusionamos spans contiguos con los mismos marks para no fragmentar.
  if (last && sameMarks(last.marks, marks)) {
    last.text += text
    return
  }
  spans.push({
    _type: 'span',
    _key: mkKey(),
    text,
    marks: [...marks],
  })
}

function sameMarks(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

function plainBlock(style: string, text: string): Block {
  return {
    _type: 'block',
    _key: mkKey(),
    style,
    children: [{ _type: 'span', _key: mkKey(), text, marks: [] }],
    markDefs: [],
  }
}

function headingStyle(depth: number): string {
  if (depth <= 1) return 'h1'
  if (depth === 2) return 'h2'
  if (depth === 3) return 'h3'
  return 'h4'
}

async function emitImageBlock(
  img: Tokens.Image,
  out: PortableBlock[],
  uploads: UploadedImage[],
  warnings: string[],
): Promise<void> {
  try {
    const uploaded = await uploadImageFromUrl(img.href)
    uploads.push(uploaded)
    const block: ImageBlock = {
      _type: 'image',
      _key: mkKey(),
      asset: { _type: 'reference', _ref: uploaded.assetId },
    }
    if (img.text) block.alt = img.text
    out.push(block)
  } catch (err) {
    const msg = (err as Error).message || 'error desconocido'
    warnings.push(`No se pudo subir imagen "${img.href}": ${msg}`)
    // Fallback: párrafo con el alt + enlace al original.
    const fallbackText = img.text
      ? `${img.text} (imagen no disponible: ${img.href})`
      : `Imagen no disponible: ${img.href}`
    out.push(plainBlock('normal', fallbackText))
  }
}

function isWhitespaceToken(t: Tokens.Generic): boolean {
  if (t.type !== 'text' && t.type !== 'escape') return false
  const maybe = t as unknown as { text?: unknown }
  return typeof maybe.text === 'string' ? maybe.text.trim() === '' : false
}

function decodeEntities(s: string): string {
  // marked suele entregar entidades ya decodificadas, pero por si acaso
  // normalizamos las más comunes.
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function mkKey(): string {
  // Sanity pide keys únicos y estables por bloque.
  // randomUUID da 36 chars; recortamos a 12 para mantenerlo legible.
  return randomUUID().replace(/-/g, '').slice(0, 12)
}
