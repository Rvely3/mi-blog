import { client } from '@/sanity/lib/client'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'
import Link from 'next/link'

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface Post {
  _id: string
  title: string
  excerpt: string
  content: PortableTextBlock[]
  publishedAt: string
  author: string
  coverImage?: SanityImageSource
  slug: { current: string }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://terrenosentrujillo.pe'

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, excerpt, content,
      publishedAt, author, coverImage, slug
    }`,
    { slug }
  )
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const ogImage = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${slug}`,
      publishedTime: post.publishedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://github.com/Rvely3',
    },
    url: `${siteUrl}/blog/${slug}`,
    ...(post.coverImage && {
      image: urlFor(post.coverImage).width(1200).height(630).url(),
    }),
  }

  const initials = post.author
    ? post.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'var(--texto-soft)', textDecoration: 'none' }}>
            Inicio
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--texto-soft)' }}>→</span>
          <span style={{ fontSize: '12px', color: 'var(--texto-mid)' }}>
            {post.title}
          </span>
        </nav>

        {/* Título */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '36px', fontWeight: 400,
          color: 'var(--texto)', lineHeight: 1.2,
          marginBottom: '1.25rem', letterSpacing: '-0.01em'
        }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{
            fontSize: '16px', color: 'var(--texto-mid)',
            lineHeight: 1.7, marginBottom: '1.75rem',
            borderLeft: '3px solid var(--terra)',
            paddingLeft: '1rem'
          }}>
            {post.excerpt}
          </p>
        )}

        {/* Autor */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '2.5rem', paddingBottom: '2rem',
          borderBottom: '0.5px solid var(--borde)'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--terra-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 500, color: 'var(--terra)',
            flexShrink: 0
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--texto)' }}>
              {post.author || 'Autor'}
            </div>
            {post.publishedAt && (
              <div style={{ fontSize: '12px', color: 'var(--texto-soft)', marginTop: '2px' }}>
                {new Date(post.publishedAt).toLocaleDateString('es-PE', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
            )}
          </div>
        </div>

        {/* Imagen de portada */}
        {post.coverImage && (
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '16/9',
            marginBottom: '2.5rem', borderRadius: '12px', overflow: 'hidden'
          }}>
            <Image
              src={urlFor(post.coverImage).width(1200).height(630).url()}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Contenido */}
        {post.content && (
          <div className="prose" style={{
            fontSize: '16px', lineHeight: 1.8,
            color: 'var(--texto-mid)'
          }}>
            <PortableText value={post.content} />
          </div>
        )}

        {/* Volver */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '0.5px solid var(--borde)' }}>
          <Link href="/" style={{
            fontSize: '13px', color: 'var(--terra)',
            textDecoration: 'none', fontWeight: 500
          }}>
            ← Volver a los artículos
          </Link>
        </div>

      </article>
    </div>
  )
}