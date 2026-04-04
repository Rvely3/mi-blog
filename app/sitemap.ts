import { client } from '@/sanity/lib/client'
import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mi-blog-three-lilac.vercel.app'

async function getPosts() {
  return client.fetch(
    `*[_type == "post"] {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()

  const postEntries = posts.map((post: { slug: string; publishedAt: string; _updatedAt: string }) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...postEntries,
  ]
}