import type { PortableTextBlock } from '@portabletext/react'
import type { SanityImageSource } from '@sanity/image-url'

/**
 * Tipos compartidos entre Sanity y el front.
 * Estos reflejan lo que devuelven las queries en sanity/lib/queries.ts;
 * si la query cambia, actualizar aquí también.
 */

export type Currency = 'PEN' | 'USD'

export type TerrenoStatus = 'disponible' | 'reservado' | 'vendido'

export type TerrenoType =
  | 'urbano'
  | 'playa'
  | 'rural'
  | 'agricola'
  | 'comercial'

export interface SanityImage {
  asset?: {
    _ref?: string
    _id?: string
    url?: string
  }
  alt?: string
  // Para compatibilidad con `urlFor`
  _type?: 'image'
  hotspot?: unknown
  crop?: unknown
}

export interface Geopoint {
  _type?: 'geopoint'
  lat: number
  lng: number
  alt?: number
}

export interface DistritoSummary {
  _id: string
  name: string
  slug: string
  shortDescription?: string
  image?: SanityImage
  order?: number
}

export interface Distrito extends DistritoSummary {
  description?: PortableTextBlock[]
  coordinates?: Geopoint
  seoTitle?: string
  seoDescription?: string
}

export interface TerrenoSummary {
  _id: string
  title: string
  slug: string
  status: TerrenoStatus
  type: TerrenoType
  featured: boolean
  area: number
  price?: number
  currency?: Currency
  priceOnRequest?: boolean
  excerpt: string
  coverImage?: SanityImage
  distrito?: {
    _id: string
    name: string
    slug: string
  }
  publishedAt?: string
}

export interface Terreno extends TerrenoSummary {
  description?: PortableTextBlock[]
  address?: string
  location?: Geopoint
  gallery?: SanityImage[]
  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImage
  _updatedAt?: string
}

export interface PostSummary {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: SanityImage
  publishedAt?: string
  author?: string
  categorias?: string[]
}

export interface Post extends PostSummary {
  content?: PortableTextBlock[]
  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImage
  _updatedAt?: string
}

export interface SiteSettings {
  _id: string
  siteName: string
  tagline?: string
  defaultMetaTitle?: string
  defaultMetaDescription?: string
  defaultOgImage?: SanityImage
  whatsapp?: string
  whatsappDefaultMessage?: string
  email?: string
  phone?: string
  address?: string
  socials?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    linkedin?: string
  }
  legal?: {
    companyName?: string
    ruc?: string
    brokerLicense?: string
  }
  analytics?: {
    ga4Id?: string
    gscVerification?: string
    metaPixelId?: string
  }
}

// Re-export útiles para otras partes del código.
export type { SanityImageSource, PortableTextBlock }
