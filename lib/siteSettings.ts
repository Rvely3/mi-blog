import { cache } from 'react'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/sanity/types'

/**
 * Obtiene el documento singleton `siteSettings` desde Sanity.
 *
 * Se envuelve con `React.cache` para que, durante un mismo render,
 * Header, Footer y WhatsAppFloat reutilicen la misma respuesta en vez
 * de disparar tres fetches. Si el documento todavía no existe en
 * Sanity (primera instalación), devuelve `null` y los consumidores
 * deben manejar ese caso con valores por defecto.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    const data = await client.fetch<SiteSettings | null>(siteSettingsQuery)
    return data ?? null
  } catch {
    return null
  }
})

/**
 * URL pública del sitio. Se toma de env var para evitar hardcodear
 * `terrenosentrujillo.pe` en múltiples lugares.
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://terrenosentrujillo.pe'
}
