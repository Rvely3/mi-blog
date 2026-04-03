import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'

interface Post {
  _id: string
  title: string
  excerpt: string
  content: any[]
  publishedAt: string
  author: string
}

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      excerpt,
      content,
      publishedAt,
      author
    }`,
    { slug }
  )
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-black">
      <article className="max-w-2xl mx-auto px-8 py-24">
        <h1 className="text-white text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-white/30 text-sm mb-12">
          {post.author && <span>{post.author}</span>}
          {post.author && post.publishedAt && <span className="mx-2">·</span>}
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString('es-PE')}</span>
          )}
        </div>
        {post.content && (
          <div className="text-white/70 leading-relaxed prose prose-invert">
            <PortableText value={post.content} />
          </div>
        )}
      </article>
    </main>
  )
}