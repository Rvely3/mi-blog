import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { formatArea, formatPrice, statusLabel, statusTone } from '@/lib/format'
import type { TerrenoSummary } from '@/sanity/types'

interface Props {
  terreno: TerrenoSummary
  priority?: boolean
}

/**
 * Tarjeta reutilizable de terreno para listados, home y hubs.
 * Mantiene el estilo editorial del sitio (tokens terra/olivo/ocre)
 * pero es más informativa que la tarjeta de blog original: muestra
 * precio, área, distrito, tipo y estado.
 */
export default function TerrenoCard({ terreno, priority = false }: Props) {
  const tone = statusTone(terreno.status)
  const img = terreno.coverImage
    ? urlFor(terreno.coverImage).width(800).height(520).fit('crop').url()
    : null

  return (
    <Link
      href={`/terrenos/${terreno.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      aria-label={`Ver terreno ${terreno.title}`}
    >
      <article
        className="post-card"
        style={{
          border: '0.5px solid var(--borde)',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#fff',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Imagen */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 10',
            background: 'var(--terra-light)',
          }}
        >
          {img ? (
            <Image
              src={img}
              alt={terreno.coverImage?.alt || terreno.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              priority={priority}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--terra)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Sin imagen
            </div>
          )}

          {/* Badges */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                background: tone.bg,
                color: tone.fg,
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '4px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase',
              }}
            >
              {statusLabel(terreno.status)}
            </span>
            {terreno.featured && (
              <span
                style={{
                  background: 'var(--terra)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                }}
              >
                Destacado
              </span>
            )}
          </div>
        </div>

        {/* Cuerpo */}
        <div
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}
        >
          {terreno.distrito && (
            <div
              style={{
                fontSize: '10px',
                color: 'var(--terra)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {terreno.distrito.name}
            </div>
          )}

          <h3
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '17px',
              fontWeight: 500,
              color: 'var(--texto)',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {terreno.title}
          </h3>

          {terreno.excerpt && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--texto-mid)',
                lineHeight: 1.55,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {terreno.excerpt}
            </p>
          )}

          {/* Precio + área */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '12px',
              borderTop: '0.5px solid var(--borde)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--texto)',
              }}
            >
              {formatPrice(terreno.price, terreno.currency, terreno.priceOnRequest)}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--texto-soft)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatArea(terreno.area)}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
