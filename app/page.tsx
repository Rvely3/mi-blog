import { client } from '@/sanity/lib/client'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  author: string
}

async function getPosts(): Promise<Post[]> {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) {
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

      {/* Hero */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '5rem 1.5rem 4rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Texto */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '11px', color: 'var(--terra)',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <span style={{ display: 'block', width: '24px', height: '1.5px', background: 'var(--terra)' }} />
              Ideas y reflexiones
            </div>
            <h1 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '40px', fontWeight: 400,
              color: 'var(--texto)', lineHeight: 1.15,
              marginBottom: '16px', letterSpacing: '-0.01em'
            }}>
              Escrito para<br />
              <em style={{ color: 'var(--terra)', fontStyle: 'italic' }}>quien quiere</em><br />
              entender más.
            </h1>
            <p style={{
              fontSize: '14px', color: 'var(--texto-mid)',
              lineHeight: 1.75, marginBottom: '2rem', maxWidth: '320px'
            }}>
              Tecnología, desarrollo web y aprendizaje — sin rodeos y con criterio.
            </p>
            <Link
              href="#articulos"
              style={{
                display: 'inline-block',
                background: 'var(--terra)', color: '#fff',
                fontSize: '13px', fontWeight: 500,
                padding: '11px 22px', borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              Ver artículos
            </Link>
          </div>

          {/* Bloque de color */}
          <div style={{
            borderRadius: '14px', height: '260px',
            background: 'var(--terra-mid)',
            display: 'flex', alignItems: 'flex-end', padding: '18px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '60%', height: '100%',
              background: 'rgba(255,255,255,0.06)',
              clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)'
            }} />
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: 'var(--olivo)', flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--texto)' }}>
                  Nuevo artículo
                </div>
                <div style={{ fontSize: '10px', color: 'var(--texto-soft)', marginTop: '1px' }}>
                  Publicado esta semana
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artículos */}
      <section
        id="articulos"
        style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem 6rem' }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '2rem'
        }}>
          <span style={{
            fontSize: '11px', color: 'var(--texto-soft)',
            letterSpacing: '0.12em', textTransform: 'uppercase'
          }}>
            Artículos
          </span>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--borde)' }} />
        </div>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--texto-soft)', fontSize: '14px' }}>
            No hay artículos todavía.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {posts.map((post, i) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                style={{ textDecoration: 'none' }}
              >
                <article style={{
                  border: '0.5px solid var(--borde)',
                  borderRadius: '16px', overflow: 'hidden',
                  background: '#fff',
                  transition: 'box-shadow 0.2s',
                }}>
                  {/* Bloque de color */}
                  <div style={{
                    height: '140px',
                    background: CARD_COLORS[i % CARD_COLORS.length],
                    display: 'flex', alignItems: 'flex-end', padding: '14px'
                  }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.92)',
                      color: 'var(--texto)', fontSize: '10px', fontWeight: 500,
                      padding: '4px 11px', borderRadius: '999px'
                    }}>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })
                        : 'Sin fecha'}
                    </span>
                  </div>

                  {/* Cuerpo */}
                  <div style={{ padding: '16px' }}>
                    {post.author && (
                      <div style={{
                        fontSize: '10px', color: 'var(--texto-soft)',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: '5px'
                      }}>
                        {post.author}
                      </div>
                    )}
                    <h2 style={{
                      fontSize: '15px', fontWeight: 500,
                      color: 'var(--texto)', lineHeight: 1.3,
                      marginBottom: '0'
                    }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{
                        fontSize: '12px', color: 'var(--texto-mid)',
                        lineHeight: 1.55, marginTop: '6px'
                      }}>
                        {post.excerpt}
                      </p>
                    )}
                    <div style={{
                      marginTop: '12px', paddingTop: '12px',
                      borderTop: '0.5px solid var(--borde)',
                      fontSize: '11px', color: 'var(--terra)',
                      fontWeight: 500
                    }}>
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