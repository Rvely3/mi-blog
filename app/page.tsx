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

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-black overflow-hidden relative">
      {/* Hero */}
      <div className="flex items-center justify-center relative" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${(i * 37 + 100) % 400 + 100}px`,
                height: `${(i * 53 + 100) % 400 + 100}px`,
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                background: `hsl(${i * 18}, 70%, 60%)`,
                animation: `float ${(i % 10) + 8}s ease-in-out infinite alternate`,
                animationDelay: `${(i % 5)}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center px-8">
          <p className="text-white/40 text-sm tracking-[0.4em] uppercase mb-6">
            Bienvenido a
          </p>
          <h1
            className="text-white font-bold leading-none mb-8"
            style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}
          >
            mi<span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>blog</span>
          </h1>
          <p className="text-white/50 text-lg max-w-md mx-auto leading-relaxed">
            Ideas, reflexiones y todo lo que vale la pena escribir.
          </p>
        </div>
      </div>

      {/* Artículos */}
      <section className="relative z-10 max-w-3xl mx-auto px-8 pb-24">
        <h2 className="text-white/40 text-sm tracking-[0.4em] uppercase mb-12">
          Artículos
        </h2>
        {posts.length === 0 ? (
          <p className="text-white/30">No hay artículos todavía.</p>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post._id}>
                <Link href={`/blog/${post.slug.current}`}>
                  <h3 className="text-white text-2xl font-bold hover:text-white/70 transition-colors duration-200 mb-3">
                    {post.title}
                  </h3>
                </Link>
                {post.excerpt && (
                  <p className="text-white/50 leading-relaxed mb-3">{post.excerpt}</p>
                )}
                <div className="text-white/30 text-sm">
                  {post.author && <span>{post.author}</span>}
                  {post.author && post.publishedAt && <span className="mx-2">·</span>}
                  {post.publishedAt && (
                    <span>{new Date(post.publishedAt).toLocaleDateString('es-PE')}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes float {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(30px, -30px) scale(1.1); }
        }
      `}</style>
    </main>
  )
}