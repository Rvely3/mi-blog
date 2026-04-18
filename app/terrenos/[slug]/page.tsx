import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  terrenoBySlugQuery,
  terrenosRelatedQuery,
  terrenosSlugsQuery,
} from '@/sanity/lib/queries'
import type { Terreno, TerrenoSummary, SanityImage } from '@/sanity/types'
import {
  formatArea,
  formatPrice,
  pricePerSqm,
  statusLabel,
  statusTone,
  typeLabel,
} from '@/lib/format'
import { terrenoWhatsappMessage, whatsappUrl } from '@/lib/whatsapp'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'
import TerrenoCard from '@/app/components/TerrenoCard'
import Breadcrumbs from '@/app/components/Breadcrumbs'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(terrenosSlugsQuery)
  return (slugs || []).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const terreno = await client.fetch<Terreno | null>(terrenoBySlugQuery, { slug })
  if (!terreno) return { title: 'Terreno no encontrado' }

  const title = terreno.seoTitle || terreno.title
  const description =
    terreno.seoDescription ||
    terreno.excerpt ||
    `Terreno en venta en ${terreno.distrito?.name || 'Trujillo'}. ${formatArea(
      terreno.area,
    )} · ${formatPrice(terreno.price, terreno.currency, terreno.priceOnRequest)}.`

  const ogImageSrc = terreno.ogImage || terreno.coverImage
  const ogImage = ogImageSrc
    ? urlFor(ogImageSrc).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title,
    description,
    alternates: { canonical: `/terrenos/${terreno.slug}` },
    openGraph: {
      title,
      description,
      url: `${getSiteUrl()}/terrenos/${terreno.slug}`,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function TerrenoPage({ params }: PageProps) {
  const { slug } = await params

  const [terreno, settings] = await Promise.all([
    client.fetch<Terreno | null>(terrenoBySlugQuery, { slug }),
    getSiteSettings(),
  ])

  if (!terreno) notFound()

  const related = terreno.distrito?._id
    ? await client.fetch<TerrenoSummary[]>(terrenosRelatedQuery, {
        slug: terreno.slug,
        distritoId: terreno.distrito._id,
      })
    : []

  const siteUrl = getSiteUrl()
  const tone = statusTone(terreno.status)
  const priceText = formatPrice(terreno.price, terreno.currency, terreno.priceOnRequest)
  const areaText = formatArea(terreno.area)
  const perSqm = pricePerSqm(terreno.price, terreno.area, terreno.currency)

  const coverUrl = terreno.coverImage
    ? urlFor(terreno.coverImage).width(1600).height(900).fit('crop').url()
    : null

  const gallery = (terreno.gallery || []).filter(Boolean)

  const waHref = whatsappUrl(
    settings?.whatsapp,
    terrenoWhatsappMessage(terreno.title, terreno.slug, siteUrl),
  )

  // JSON-LD (Product + BreadcrumbList). RealEstateListing no está 100%
  // soportado por Google Rich Results, así que usamos Product como más
  // universal, complementado con address/geo cuando existen.
  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: terreno.title,
    description: terreno.excerpt,
    image: coverUrl ? [coverUrl] : undefined,
    brand: {
      '@type': 'Organization',
      name: settings?.siteName || 'Terrenosentrujillo.pe',
    },
    category: typeLabel(terreno.type),
    ...(terreno.price && !terreno.priceOnRequest
      ? {
          offers: {
            '@type': 'Offer',
            price: terreno.price,
            priceCurrency: terreno.currency || 'USD',
            availability:
              terreno.status === 'disponible'
                ? 'https://schema.org/InStock'
                : terreno.status === 'reservado'
                  ? 'https://schema.org/LimitedAvailability'
                  : 'https://schema.org/SoldOut',
            url: `${siteUrl}/terrenos/${terreno.slug}`,
          },
        }
      : {}),
    ...(terreno.address || terreno.distrito
      ? {
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'La Libertad',
            addressLocality: terreno.distrito?.name || 'Trujillo',
            addressCountry: 'PE',
            ...(terreno.address ? { streetAddress: terreno.address } : {}),
          },
        }
      : {}),
    ...(terreno.location
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: terreno.location.lat,
            longitude: terreno.location.lng,
          },
        }
      : {}),
  }

  return (
    <div style={{ background: '#fff' }}>
      <style>{`
        .terreno-layout {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        .terreno-sticky {
          position: sticky;
          top: 24px;
        }
        .terreno-gallery {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 8px;
          aspect-ratio: 16 / 9;
          border-radius: 14px;
          overflow: hidden;
        }
        .terreno-gallery > *:first-child { grid-row: span 2; }
        @media (max-width: 900px) {
          .terreno-layout { grid-template-columns: 1fr; }
          .terreno-sticky { position: static; }
          .terreno-gallery { grid-template-columns: 1fr 1fr; grid-template-rows: 2fr 1fr 1fr; aspect-ratio: auto; }
          .terreno-gallery > *:first-child { grid-column: span 2; grid-row: span 1; height: 260px; }
        }
      `}</style>

      <section
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '2rem 1.5rem 4rem',
        }}
      >
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Terrenos', href: '/terrenos' },
            ...(terreno.distrito
              ? [
                  {
                    label: terreno.distrito.name,
                    href: `/terrenos?distrito=${terreno.distrito.slug}`,
                  },
                ]
              : []),
            { label: terreno.title },
          ]}
          siteUrl={siteUrl}
        />

        {/* Cabecera */}
        <header style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                background: tone.bg,
                color: tone.fg,
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
              }}
            >
              {statusLabel(terreno.status)}
            </span>
            <span
              style={{
                background: 'var(--terra-light)',
                color: 'var(--terra)',
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
              }}
            >
              {typeLabel(terreno.type)}
            </span>
            {terreno.featured && (
              <span
                style={{
                  background: 'var(--ocre-light)',
                  color: 'var(--ocre)',
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em',
                }}
              >
                ★ Destacado
              </span>
            )}
          </div>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '34px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 4px 0',
              lineHeight: 1.15,
            }}
          >
            {terreno.title}
          </h1>
          {terreno.distrito && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--texto-soft)',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              {terreno.distrito.name} · Trujillo, La Libertad
              {terreno.address ? ` · ${terreno.address}` : ''}
            </p>
          )}
        </header>

        {/* Galería */}
        {coverUrl && (
          <div className="terreno-gallery" style={{ marginBottom: '2rem' }}>
            <GalleryItem image={terreno.coverImage!} alt={terreno.title} priority />
            {gallery.slice(0, 4).map((g, i) => (
              <GalleryItem
                key={i}
                image={g}
                alt={g.alt || `${terreno.title} ${i + 2}`}
              />
            ))}
            {/* Placeholders si no hay suficientes imágenes para el grid */}
            {Array.from({ length: Math.max(0, 4 - gallery.length) }).map((_, i) => (
              <div
                key={`ph-${i}`}
                style={{
                  background: 'var(--terra-light)',
                  width: '100%',
                  height: '100%',
                }}
              />
            ))}
          </div>
        )}

        <div className="terreno-layout">
          {/* Columna izquierda: descripción */}
          <div>
            {terreno.excerpt && (
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--texto-mid)',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                }}
              >
                {terreno.excerpt}
              </p>
            )}

            {terreno.description && terreno.description.length > 0 ? (
              <div
                style={{
                  fontSize: '15px',
                  color: 'var(--texto)',
                  lineHeight: 1.75,
                }}
              >
                <PortableText
                  value={terreno.description as PortableTextBlock[]}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p style={{ margin: '0 0 1em 0' }}>{children}</p>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '22px',
                            fontWeight: 500,
                            color: 'var(--texto)',
                            margin: '2rem 0 0.75rem 0',
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          style={{
                            fontSize: '17px',
                            fontWeight: 500,
                            color: 'var(--texto)',
                            margin: '1.5rem 0 0.5rem 0',
                          }}
                        >
                          {children}
                        </h3>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => (
                        <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1em 0' }}>
                          {children}
                        </ul>
                      ),
                    },
                    listItem: {
                      bullet: ({ children }) => (
                        <li style={{ marginBottom: '0.35em' }}>{children}</li>
                      ),
                    },
                    marks: {
                      link: ({ value, children }) => (
                        <a
                          href={value?.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--terra)' }}
                        >
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
              </div>
            ) : (
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--texto-soft)',
                  fontStyle: 'italic',
                }}
              >
                Escríbenos por WhatsApp para recibir el detalle completo del terreno.
              </p>
            )}

            {terreno.address && (
              <div
                style={{
                  marginTop: '2rem',
                  padding: '1.25rem',
                  background: 'var(--fondo)',
                  borderRadius: '12px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--texto-soft)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: '0 0 6px 0',
                  }}
                >
                  Ubicación
                </p>
                <p style={{ fontSize: '14px', color: 'var(--texto)', margin: 0 }}>
                  {terreno.address}
                </p>
              </div>
            )}
          </div>

          {/* Columna derecha: card de datos clave */}
          <aside>
            <div
              className="terreno-sticky"
              style={{
                border: '1px solid var(--borde)',
                borderRadius: '14px',
                padding: '1.5rem',
                background: '#fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--texto-soft)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '0 0 6px 0',
                }}
              >
                Precio
              </p>
              <p
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '28px',
                  color: 'var(--terra)',
                  margin: '0 0 4px 0',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}
              >
                {priceText}
              </p>
              {perSqm && (
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--texto-soft)',
                    margin: '0 0 1.25rem 0',
                  }}
                >
                  {perSqm}
                </p>
              )}

              <dl
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px 16px',
                  margin: '0 0 1.5rem 0',
                  fontSize: '13px',
                }}
              >
                <DataRow label="Área" value={areaText} />
                <DataRow label="Tipo" value={typeLabel(terreno.type)} />
                <DataRow label="Estado" value={statusLabel(terreno.status)} />
                {terreno.distrito && (
                  <DataRow label="Distrito" value={terreno.distrito.name} />
                )}
              </dl>

              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    background: '#25D366',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    textAlign: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    marginBottom: '8px',
                  }}
                >
                  Escribir por WhatsApp
                </a>
              ) : (
                <Link
                  href="/contacto"
                  style={{
                    display: 'block',
                    background: 'var(--terra)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    textAlign: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    marginBottom: '8px',
                  }}
                >
                  Contactar
                </Link>
              )}

              {settings?.email && (
                <a
                  href={`mailto:${settings.email}?subject=Consulta por ${terreno.title}`}
                  style={{
                    display: 'block',
                    border: '1px solid var(--borde)',
                    color: 'var(--texto)',
                    fontSize: '13px',
                    textAlign: 'center',
                    padding: '11px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Enviar correo
                </a>
              )}
            </div>
          </aside>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '22px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: 'var(--texto)',
                margin: '0 0 1.25rem 0',
              }}
            >
              Otros terrenos en {terreno.distrito?.name || 'la zona'}
            </h2>
            <style>{`
              .related-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
              }
              @media (max-width: 900px) {
                .related-grid { grid-template-columns: 1fr; }
              }
            `}</style>
            <div className="related-grid">
              {related.map((r) => (
                <TerrenoCard key={r._id} terreno={r} />
              ))}
            </div>
          </section>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
    </div>
  )
}

// ── Sub-componentes ──

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        style={{
          fontSize: '11px',
          color: 'var(--texto-soft)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        {label}
      </dt>
      <dd style={{ fontSize: '14px', color: 'var(--texto)', margin: '2px 0 0 0' }}>
        {value}
      </dd>
    </div>
  )
}

function GalleryItem({
  image,
  alt,
  priority = false,
}: {
  image: SanityImage
  alt: string
  priority?: boolean
}) {
  const src = urlFor(image).width(1200).height(800).fit('crop').url()
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '120px' }}>
      <Image
        src={src}
        alt={image.alt || alt}
        fill
        sizes="(max-width: 900px) 100vw, 60vw"
        style={{ objectFit: 'cover' }}
        priority={priority}
      />
    </div>
  )
}
