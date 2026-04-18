/**
 * Queries GROQ reutilizables.
 *
 * Mantener las proyecciones alineadas con los tipos en `sanity/types.ts`.
 * Cuando se agregue un campo nuevo al schema y quieras consumirlo en el
 * front, añádelo aquí en la proyección y también en el tipo TS.
 */

// ── Fragmentos reutilizables ──

const distritoRefProjection = /* groq */ `
  distrito->{
    _id,
    name,
    "slug": slug.current
  }
`

const terrenoSummaryProjection = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  status,
  type,
  featured,
  area,
  price,
  currency,
  priceOnRequest,
  excerpt,
  coverImage,
  publishedAt,
  ${distritoRefProjection}
`

const terrenoFullProjection = /* groq */ `
  ${terrenoSummaryProjection},
  description,
  address,
  location,
  gallery,
  seoTitle,
  seoDescription,
  ogImage,
  _updatedAt
`

const distritoSummaryProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  shortDescription,
  image,
  order
`

const postSummaryProjection = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  author,
  categorias
`

// ── Site settings ──

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    _id,
    siteName,
    tagline,
    defaultMetaTitle,
    defaultMetaDescription,
    defaultOgImage,
    whatsapp,
    whatsappDefaultMessage,
    email,
    phone,
    address,
    socials,
    legal,
    analytics
  }
`

// ── Home ──

export const homePageQuery = /* groq */ `
{
  "terrenosDestacados": *[_type == "terreno" && featured == true && status != "vendido"]
    | order(publishedAt desc)[0...6]{ ${terrenoSummaryProjection} },
  "terrenosRecientes": *[_type == "terreno" && status != "vendido"]
    | order(publishedAt desc)[0...6]{ ${terrenoSummaryProjection} },
  "distritos": *[_type == "distrito"]
    | order(order asc, name asc)[0...6]{ ${distritoSummaryProjection} },
  "posts": *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc)[0...3]{ ${postSummaryProjection} }
}
`

// ── Terrenos ──

export const terrenosListQuery = /* groq */ `
{
  "items": *[
    _type == "terreno"
    && (!defined($distritoSlug) || distrito->slug.current == $distritoSlug)
  ] | order(featured desc, publishedAt desc)[$start...$end]{
    ${terrenoSummaryProjection}
  },
  "total": count(*[
    _type == "terreno"
    && (!defined($distritoSlug) || distrito->slug.current == $distritoSlug)
  ]),
  "distritos": *[_type == "distrito"] | order(order asc, name asc){
    ${distritoSummaryProjection}
  }
}
`

export const terrenoBySlugQuery = /* groq */ `
*[_type == "terreno" && slug.current == $slug][0]{
  ${terrenoFullProjection}
}
`

export const terrenosRelatedQuery = /* groq */ `
*[
  _type == "terreno"
  && slug.current != $slug
  && status != "vendido"
  && distrito._ref == $distritoId
] | order(featured desc, publishedAt desc)[0...3]{
  ${terrenoSummaryProjection}
}
`

export const terrenosSlugsQuery = /* groq */ `
*[_type == "terreno" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt,
  publishedAt
}
`

// ── Distritos ──

export const distritosListQuery = /* groq */ `
*[_type == "distrito"] | order(order asc, name asc){
  ${distritoSummaryProjection}
}
`

export const distritoBySlugQuery = /* groq */ `
*[_type == "distrito" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  shortDescription,
  description,
  image,
  coordinates,
  order,
  seoTitle,
  seoDescription
}
`

export const distritosSlugsQuery = /* groq */ `
*[_type == "distrito" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}
`

// ── Posts ──

export const postsListQuery = /* groq */ `
*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  ${postSummaryProjection}
}
`
