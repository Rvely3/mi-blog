import { client } from '@/sanity/lib/client'
import type { MetadataRoute } from 'next'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://terrenosentrujillo.pe'

async function getPosts() {
  return client.fetch(
    `*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`,
  )
}

/**
 * Sitemap mínimo de la Fase 1.
 * Cuando existan los schemas `terreno` y `distrito`, se agregan aquí sus rutas
 * (por ahora no existen en Sanity, así que no las incluimos para evitar
 * queries que devuelvan vacío innecesariamente).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()

  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/terrenos`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/como-funciona`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/sobre-nosotros`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${siteUrl}/aviso-legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ]

  const postEntries: MetadataRoute.Sitemap = posts.map(
    (post: { slug: string; publishedAt?: string; _updatedAt?: string }) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt || post.publishedAt || now),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }),
  )

  return [...staticEntries, ...postEntries]
}
