import { client } from '@/sanity/lib/client'
import type { MetadataRoute } from 'next'
import {
  distritosSlugsQuery,
  terrenosSlugsQuery,
} from '@/sanity/lib/queries'
import { getSiteUrl } from '@/lib/siteSettings'

const siteUrl = getSiteUrl()

async function getPosts() {
  return client.fetch<{ slug: string; publishedAt?: string; _updatedAt?: string }[]>(
    `*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`,
  )
}

/**
 * Sitemap completo.
 * Incluye rutas estáticas + terrenos + hubs de distrito + posts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, terrenos, distritos] = await Promise.all([
    getPosts(),
    client.fetch<{ slug: string; _updatedAt?: string; publishedAt?: string }[]>(
      terrenosSlugsQuery,
    ),
    client.fetch<{ slug: string; _updatedAt?: string }[]>(distritosSlugsQuery),
  ])

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

  const terrenoEntries: MetadataRoute.Sitemap = (terrenos || []).map((t) => ({
    url: `${siteUrl}/terrenos/${t.slug}`,
    lastModified: new Date(t._updatedAt || t.publishedAt || now),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const distritoEntries: MetadataRoute.Sitemap = (distritos || []).map((d) => ({
    url: `${siteUrl}/terrenos/zona/${d.slug}`,
    lastModified: new Date(d._updatedAt || now),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt || now),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticEntries, ...terrenoEntries, ...distritoEntries, ...postEntries]
}
