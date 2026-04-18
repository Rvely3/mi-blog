import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import {
  distritoBySlugQuery,
  distritosSlugsQuery,
  terrenosListQuery,
} from '@/sanity/lib/queries'
import type { Distrito, TerrenoSummary } from '@/sanity/types'
import TerrenoCard from '@/app/components/TerrenoCard'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import { getSiteUrl } from '@/lib/siteSettings'

type PageProps = {
  params: Promise<{ distrito: string }>
}

interface ListResult {
  items: TerrenoSummary[]
  total: number
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(distritosSlugsQuery)
  return (slugs || []).map((s) => ({ distrito: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { distrito: slug } = await params
  const distrito = await client.fetch<Distrito | null>(distritoBySlugQuery, { slug })
  if (!distrito) return { title: 'Zona no encontrada' }

  const title =
    distrito.seoTitle || `Terrenos en venta en ${distrito.name}, Trujillo`
  const description =
    distrito.seoDescription ||
    distrito.shortDescription ||
    `Catálogo de terrenos en ${distrito.name}, Trujillo. Precio, área, ubicación y contacto directo por WhatsApp.`

  const ogImage = distrito.image
    ? urlFor(distrito.image).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title,
    description,
    alternates: { canonical: `/terrenos/zona/${distrito.slug}` },
    openGraph: {
      title,
      description,
      url: `${getSiteUrl()}/terrenos/zona/${distrito.slug}`,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function DistritoPage({ params }: PageProps) {
  const { distrito: slug } = await params

  const distrito = await client.fetch<Distrito | null>(distritoBySlugQuery, { slug })
  if (!distrito) notFound()

  const terrenos = await client.fetch<ListResult>(terrenosListQuery, {
    distritoSlug: distrito.slug,
    start: 0,
    end: 6,
  })

  const siteUrl = getSiteUrl()
  const heroImg = distrito.image
    ? urlFor(distrito.image).width(1600).height(600).fit('crop').url()
    : null

  // JSON-LD: Place + BreadcrumbList
  const placeLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: distrito.name,
    description: distrito.shortDescription,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Trujillo, La Libertad, Perú',
    },
    ...(distrito.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: distrito.coordinates.lat,
            longitude: distrito.coordinates.lng,
          },
        }
      : {}),
  }

  return (
    <div style={{ background: '#fff' }}>
      <section
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '2rem 1.5rem 4rem',
        }}
      >
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Terrenos', href: '/terrenos' },
            { label: distrito.name },
          ]}
          siteUrl={siteUrl}
        />

        {/* Hero del distrito */}
        {heroImg ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '280px',
              borderRadius: '14px',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            <Image
              src={heroImg}
              alt={distrito.image?.alt || distrito.name}
              fill
              priority
              sizes="(max-width: 1120px) 100vw, 1120px"
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '24px',
                bottom: '20px',
                color: '#fff',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  margin: '0 0 6px 0',
                  opacity: 0.9,
                }}
              >
                Trujillo · La Libertad
              </p>
              <h1
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '34px',
                  fontWeight: 400,
                  margin: 0,
                  letterSpacing: '-0.01em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                Terrenos en {distrito.name}
              </h1>
            </div>
          </div>
        ) : (
          <header style={{ marginBottom: '2rem' }}>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--terra)',
                margin: '0 0 6px 0',
              }}
            >
              Trujillo · La Libertad
            </p>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '34px',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: 'var(--texto)',
                margin: 0,
              }}
            >
              Terrenos en {distrito.name}
            </h1>
          </header>
        )}

        {/* Introducción */}
        {distrito.shortDescription && (
          <p
            style={{
              fontSize: '15px',
              color: 'var(--texto-mid)',
              lineHeight: 1.7,
              maxWidth: '720px',
              margin: '0 0 2rem 0',
            }}
          >
            {distrito.shortDescription}
          </p>
        )}

        {/* Descripción editorial */}
        {distrito.description && distrito.description.length > 0 && (
          <div
            style={{
              fontSize: '15px',
              color: 'var(--texto)',
              lineHeight: 1.75,
              maxWidth: '720px',
              marginBottom: '3rem',
            }}
          >
            <PortableText
              value={distrito.description as PortableTextBlock[]}
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
                },
              }}
            />
          </div>
        )}

        {/* Listado de terrenos del distrito */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '22px',
              fontWeight: 500,
              color: 'var(--texto)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Terrenos disponibles en {distrito.name}
          </h2>
          {terrenos.total > 6 && (
            <Link
              href={`/terrenos?distrito=${distrito.slug}`}
              style={{
                fontSize: '13px',
                color: 'var(--terra)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Ver todos ({terrenos.total}) →
            </Link>
          )}
        </div>

        {terrenos.items.length === 0 ? (
          <div
            style={{
              border: '1px dashed var(--borde)',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              color: 'var(--texto-soft)',
            }}
          >
            <p style={{ fontSize: '14px', margin: 0 }}>
              Pronto publicaremos terrenos en {distrito.name}. Escríbenos para
              avisarte apenas se listen.
            </p>
          </div>
        ) : (
          <>
            <style>{`
              .zona-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
              }
              @media (max-width: 1024px) {
                .zona-grid { grid-template-columns: repeat(2, 1fr); }
              }
              @media (max-width: 640px) {
                .zona-grid { grid-template-columns: 1fr; }
              }
            `}</style>
            <div className="zona-grid">
              {terrenos.items.map((t, i) => (
                <TerrenoCard key={t._id} terreno={t} priority={i < 3} />
              ))}
            </div>
          </>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }}
      />
    </div>
  )
}
