import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { homePageQuery } from '@/sanity/lib/queries'
import type {
  DistritoSummary,
  PostSummary,
  TerrenoSummary,
} from '@/sanity/types'
import { getSiteSettings, getSiteUrl } from '@/lib/siteSettings'
import { whatsappUrl } from '@/lib/whatsapp'
import TerrenoCard from '@/app/components/TerrenoCard'

interface HomeData {
  terrenosDestacados: TerrenoSummary[]
  terrenosRecientes: TerrenoSummary[]
  distritos: DistritoSummary[]
  posts: PostSummary[]
}

export default async function Home() {
  const [data, settings] = await Promise.all([
    client.fetch<HomeData>(homePageQuery),
    getSiteSettings(),
  ])

  const siteUrl = getSiteUrl()
  const destacados =
    data.terrenosDestacados?.length > 0
      ? data.terrenosDestacados
      : data.terrenosRecientes || []
  const distritos = data.distritos || []
  const posts = data.posts || []

  const waHref = whatsappUrl(
    settings?.whatsapp,
    settings?.whatsappDefaultMessage ||
      'Hola, vi su web Terrenosentrujillo.pe y quisiera más información.',
  )

  // JSON-LD: Organization / LocalBusiness para la home
  const orgLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: settings?.siteName || 'Terrenosentrujillo.pe',
    url: siteUrl,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Trujillo, La Libertad, Perú',
    },
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    ...(settings?.socials
      ? {
          sameAs: Object.values(settings.socials).filter(
            (v): v is string => typeof v === 'string' && v.length > 0,
          ),
        }
      : {}),
  }

  return (
    <div style={{ background: '#fff' }}>
      <style>{`
        @media (max-width: 900px) {
          .home-hero-grid { grid-template-columns: 1fr !important; }
          .home-hero-block { display: none !important; }
          .home-grid-3 { grid-template-columns: 1fr !important; }
          .home-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 901px) and (max-width: 1024px) {
          .home-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        style={{ maxWidth: '1120px', margin: '0 auto', padding: '4.5rem 1.5rem 3rem' }}
      >
        <div
          className="home-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11px',
                color: 'var(--terra)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '1.5px',
                  background: 'var(--terra)',
                }}
              />
              Trujillo · La Libertad
            </div>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '44px',
                fontWeight: 400,
                color: 'var(--texto)',
                lineHeight: 1.1,
                marginBottom: '18px',
                letterSpacing: '-0.015em',
              }}
            >
              Terrenos en{' '}
              <em style={{ color: 'var(--terra)', fontStyle: 'italic' }}>Trujillo</em>,
              <br />
              con información clara.
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--texto-mid)',
                lineHeight: 1.75,
                marginBottom: '2rem',
                maxWidth: '420px',
              }}
            >
              Precio, área, ubicación y el contacto directo con el corredor por
              WhatsApp. Sin rodeos, sin intermediarios extra.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/terrenos"
                style={{
                  display: 'inline-block',
                  background: 'var(--terra)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Ver terrenos
              </Link>
              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#fff',
                    color: 'var(--texto)',
                    border: '1px solid var(--borde)',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Escribir por WhatsApp
                </a>
              ) : (
                <Link
                  href="/contacto"
                  style={{
                    display: 'inline-block',
                    background: '#fff',
                    color: 'var(--texto)',
                    border: '1px solid var(--borde)',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Contactar
                </Link>
              )}
            </div>
          </div>

          {/* Bloque decorativo */}
          <div
            className="home-hero-block"
            style={{
              borderRadius: '14px',
              height: '320px',
              background: 'var(--terra-mid)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60%',
                height: '100%',
                background: 'rgba(255,255,255,0.06)',
                clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <div
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--olivo)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--texto)' }}>
                  Huanchaco · Víctor Larco · Centro
                </div>
                <div style={{ fontSize: '11px', color: 'var(--texto-soft)', marginTop: '2px' }}>
                  Zonas con alta demanda
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TERRENOS DESTACADOS ── */}
      {destacados.length > 0 && (
        <section
          style={{ maxWidth: '1120px', margin: '0 auto', padding: '3rem 1.5rem' }}
        >
          <SectionHeader
            eyebrow="Catálogo"
            title="Terrenos destacados"
            action={{ label: 'Ver todos', href: '/terrenos' }}
          />
          <div
            className="home-grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}
          >
            {destacados.slice(0, 6).map((t, i) => (
              <TerrenoCard key={t._id} terreno={t} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      {/* ── DISTRITOS ── */}
      {distritos.length > 0 && (
        <section
          style={{ maxWidth: '1120px', margin: '0 auto', padding: '3rem 1.5rem' }}
        >
          <SectionHeader eyebrow="Zonas" title="Distritos donde operamos" />
          <div
            className="home-grid-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            {distritos.map((d) => (
              <DistritoCard key={d._id} distrito={d} />
            ))}
          </div>
        </section>
      )}

      {/* ── CÓMO FUNCIONA ── */}
      <section
        style={{ maxWidth: '1120px', margin: '0 auto', padding: '3rem 1.5rem' }}
      >
        <SectionHeader eyebrow="Proceso" title="Cómo funciona" />
        <div
          className="home-grid-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {[
            {
              n: '01',
              title: 'Explora el catálogo',
              body: 'Revisa fichas con precio, área, ubicación y fotos. Filtra por distrito.',
            },
            {
              n: '02',
              title: 'Escríbenos por WhatsApp',
              body: 'Coordinamos una visita o te enviamos más información sin compromiso.',
            },
            {
              n: '03',
              title: 'Acompañamos el trámite',
              body: 'Te guiamos en el cierre: minuta, pago, firma notarial y registral.',
            },
          ].map((step) => (
            <div
              key={step.n}
              style={{
                border: '1px solid var(--borde)',
                borderRadius: '14px',
                padding: '1.5rem',
                background: '#fff',
              }}
            >
              <p
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '28px',
                  color: 'var(--terra)',
                  margin: '0 0 8px 0',
                  fontWeight: 400,
                }}
              >
                {step.n}
              </p>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'var(--texto)',
                  margin: '0 0 6px 0',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--texto-mid)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOG ── */}
      {posts.length > 0 && (
        <section
          style={{ maxWidth: '1120px', margin: '0 auto', padding: '3rem 1.5rem' }}
        >
          <SectionHeader
            eyebrow="Blog"
            title="Guías y zonas"
            action={{ label: 'Ver blog', href: '/blog' }}
          />
          <div
            className="home-grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {posts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA FINAL ── */}
      <section
        style={{
          background: 'var(--fondo)',
          marginTop: '3rem',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '4rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'var(--texto)',
              margin: '0 0 12px 0',
            }}
          >
            ¿Buscas un terreno específico?
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--texto-mid)',
              maxWidth: '520px',
              margin: '0 auto 1.5rem',
              lineHeight: 1.7,
            }}
          >
            Cuéntanos zona, área y presupuesto. Te avisamos cuando aparezca algo
            que calce con lo que buscas.
          </p>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'var(--terra)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Escribir por WhatsApp
            </a>
          ) : (
            <Link
              href="/contacto"
              style={{
                display: 'inline-block',
                background: 'var(--terra)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Contactar
            </Link>
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
    </div>
  )
}

// ── Sub-componentes ──

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: { label: string; href: string }
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--terra)',
            margin: '0 0 4px 0',
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '26px',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--texto)',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          style={{
            fontSize: '13px',
            color: 'var(--terra)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          {action.label} →
        </Link>
      )}
    </div>
  )
}

function DistritoCard({ distrito }: { distrito: DistritoSummary }) {
  const img = distrito.image
    ? urlFor(distrito.image).width(600).height(400).fit('crop').url()
    : null

  return (
    <Link
      href={`/terrenos/zona/${distrito.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          aspectRatio: '3 / 4',
          background: 'var(--terra-light)',
        }}
      >
        {img ? (
          <Image
            src={img}
            alt={distrito.image?.alt || distrito.name}
            fill
            sizes="(max-width: 900px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        ) : null}
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
            left: '14px',
            bottom: '14px',
            color: '#fff',
          }}
        >
          <p
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              fontWeight: 500,
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {distrito.name}
          </p>
          <p
            style={{
              fontSize: '11px',
              opacity: 0.85,
              margin: '2px 0 0 0',
              letterSpacing: '0.04em',
            }}
          >
            Ver terrenos →
          </p>
        </div>
      </div>
    </Link>
  )
}

function PostCard({ post }: { post: PostSummary }) {
  const img = post.coverImage
    ? urlFor(post.coverImage).width(640).height(400).fit('crop').url()
    : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <article
        style={{
          border: '1px solid var(--borde)',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#fff',
          height: '100%',
        }}
      >
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
              alt={post.coverImage?.alt || post.title}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : null}
        </div>
        <div style={{ padding: '14px 16px 16px' }}>
          <h3
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--texto)',
              margin: '0 0 6px 0',
              lineHeight: 1.35,
            }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--texto-mid)',
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {post.excerpt}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
