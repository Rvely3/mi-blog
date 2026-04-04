import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
    return builder.image(source)
}

interface Post {
    _id: string
    title: string
    excerpt: string
    content: any[]
    publishedAt: string
    author: string
    coverImage?: any
    slug: { current: string }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mi-blog-three-lilac.vercel.app'

async function getPost(slug: string): Promise<Post | null> {
    return client.fetch(
        `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      excerpt,
      content,
      publishedAt,
      author,
      coverImage,
      slug
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
        alternates: {
            canonical: `${siteUrl}/blog/${slug}`,
        },
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
        },
        url: `${siteUrl}/blog/${slug}`,
        ...(post.coverImage && {
            image: urlFor(post.coverImage).width(1200).height(630).url(),
        }),
    }

    return (
        <main className="min-h-screen bg-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <article className="max-w-2xl mx-auto px-8 py-24">
                <h1 className="text-white text-4xl font-bold mb-4">{post.title}</h1>
                <div className="text-white/30 text-sm mb-12">
                    {post.author && <span>{post.author}</span>}
                    {post.author && post.publishedAt && <span className="mx-2">·</span>}
                    {post.publishedAt && (
                        <span>{new Date(post.publishedAt).toLocaleDateString('es-PE')}</span>
                    )}
                </div>
                {post.coverImage && (
                    <div className="relative w-full aspect-video mb-12 rounded-lg overflow-hidden">
                        <Image
                            src={urlFor(post.coverImage).width(1200).height(630).url()}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
                {post.content && (
                    <div className="text-white/70 leading-relaxed prose prose-invert">
                        <PortableText value={post.content} />
                    </div>
                )}
            </article>
        </main>
    )
}