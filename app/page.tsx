import { client } from '@/sanity/lib/client'
import Link from 'next/link'

/**
 * Home temporal de Fase 1.
 * El layout y el grid de artículos se mantienen del proyecto original
 * para no bloquear el deploy; el copy y la marca ya apuntan a
 * Terrenosentrujillo.pe. La home transaccional completa (hero con
 * buscador, terrenos destacados, distritos, FAQ, CTAs) se construye
 * en la Fase 3 del plan.
 */

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt?: string
  author?: string
}

async function getPosts(): Promise<Post[]> {
  return client.fetch(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author
  }`)
}

const CARD_COLORS = ['#C07848', '#4A7C59', '#C8861A']

export default async function Home() {
  const posts = await getPosts()

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <style>{`
  @media (max-width: 768px) {
    .hero-grid { grid-template-columns: 1fr !important; }
    .hero-color-block { display: none !important; }
    .posts-grid { grid-template-columns: 1fr !important; }
    .hero-section { padding: 3rem 1.25rem 2rem !important; }
    .posts-section { padding: 0 1.25rem 4rem !important; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .posts-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`}</style>

      {/* Hero temporal */}
      <section
        className="hero-section"
        style={{ maxWidth: '1120px', margin: '0 auto', padding: '5rem 1.5rem 4rem' }}
      >
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Texto */}
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
                fontSize: '40px',
                fontWeight: 400,
                color: 'var(--texto)',
                lineHeight: 1.15,
                marginBottom: '16px',
                letterSpacing: '-0.01em',
              }}
            >
              Terrenos en <em style={{ color: 'var(--terra)', fontStyle: 'italic' }}>Trujillo</em>
              ,<br />
              con información clara.
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--texto-mid)',
                lineHeight: 1.75,
                marginBottom: '2rem',
                maxWidth: '360px',
              }}
            >
              Fichas con precio, área y ubicación. Contacto directo por WhatsApp con el
              corredor. Sin rodeos y sin intermediarios extra.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/terrenos"
                style={{
                  display: 'inline-block',
                  background: 'var(--terra)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '11px 22px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Ver terrenos
              </Link>
              <Link
                href="/contacto"
                style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: 'var(--texto)',
                  border: '1px solid var(--borde)',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '11px 22px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Contactar
              </Link>
            </div>
          </div>

          {/* Bloque de color */}
          <div
            className="hero-color-block"
            style={{
              borderRadius: '14px',
              height: '260px',
              background: 'var(--terra-mid)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '18px',
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
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
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
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--texto)' }}>
                  Huanchaco · Víctor Larco · Centro
                </div>
                <div style={{ fontSize: '10px', color: 'var(--texto-soft)', marginTop: '1px' }}>
                  Zonas con alta demanda
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog: últimas notas (ayuda SEO) */}
      <section
        id="articulos"
        className="posts-section"
        style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1.5rem 6rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '2rem',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--texto-soft)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Desde el blog
          </span>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--borde)' }} />
        </div>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--texto-soft)', fontSize: '14px' }}>
            Pronto publicaremos artículos sobre comprar terreno en Trujillo, zonas, trámites y más.
          </p>
        ) : (
          <div
            className="posts-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {posts.map((post, i) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                style={{ textDecoration: 'none' }}
              >
                <article
                  className="post-card"
                  style={{
                    border: '0.5px solid var(--borde)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#fff',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      height: '140px',
                      background: CARD_COLORS[i % CARD_COLORS.length],
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '14px',
                    }}
                  >
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        color: 'var(--texto)',
                        fontSize: '10px',
                        fontWeight: 500,
                        padding: '4px 11px',
                        borderRadius: '999px',
                      }}
                    >
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('es-PE', {
                            day: 'numeric',
                            month: 'long',
                          })
                        : 'Sin fecha'}
                    </span>
                  </div>

                  <div style={{ padding: '16px' }}>
                    {post.author && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--texto-soft)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: '5px',
                        }}
                      >
                        {post.author}
                      </div>
                    )}
                    <h2
                      style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'var(--texto)',
                        lineHeight: 1.3,
                        marginBottom: 0,
                      }}
                    >
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--texto-mid)',
                          lineHeight: 1.55,
                          marginTop: '6px',
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '0.5px solid var(--borde)',
                        fontSize: '11px',
                        color: 'var(--terra)',
                        fontWeight: 500,
                      }}
                    >
                      Leer artículo →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
