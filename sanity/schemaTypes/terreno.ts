import { defineField, defineType } from 'sanity'

/**
 * Terreno — ficha transaccional.
 *
 * Este es el schema más importante del sitio: cada documento se renderiza
 * como `/terrenos/[slug]` (ficha) y aparece en listados, hubs de distrito
 * y home. Está pensado para:
 *  - ser editado en <5 min por un corredor no técnico,
 *  - dar a Google toda la info estructurada necesaria (JSON-LD Product /
 *    RealEstateListing se generan desde estos campos),
 *  - y alimentar la UX transaccional (CTA WhatsApp, galería, mapa).
 *
 * Campos "nice-to-have" que intencionalmente NO están en MVP:
 *  - servicios (agua, luz, desagüe) → se agrega en Fase 2.5 si hace falta
 *  - documentos (partida registral, minuta) → idem
 *  - frente/fondo en metros → idem
 *  - código interno de referencia → se maneja con el slug por ahora
 */
export default defineType({
  name: 'terreno',
  title: 'Terreno',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal', default: true },
    { name: 'location', title: 'Ubicación' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Identidad ──
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Ej: "Terreno 400 m² en Huanchaco, a 3 cuadras del malecón".',
      validation: (Rule) => Rule.required().min(10).max(120),
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),

    // ── Estado y clasificación ──
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Disponible', value: 'disponible' },
          { title: 'Reservado', value: 'reservado' },
          { title: 'Vendido', value: 'vendido' },
        ],
        layout: 'radio',
      },
      initialValue: 'disponible',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'type',
      title: 'Tipo de terreno',
      type: 'string',
      options: {
        list: [
          { title: 'Urbano', value: 'urbano' },
          { title: 'Playa', value: 'playa' },
          { title: 'Rural', value: 'rural' },
          { title: 'Agrícola', value: 'agricola' },
          { title: 'Comercial / Industrial', value: 'comercial' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'featured',
      title: 'Destacado en home',
      type: 'boolean',
      initialValue: false,
      description: 'Si está activo, aparece en la sección de destacados.',
      group: 'main',
    }),

    // ── Precio y área ──
    defineField({
      name: 'area',
      title: 'Área (m²)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      group: 'main',
    }),
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
      description: 'Deja vacío si el precio es a consultar.',
      validation: (Rule) => Rule.positive(),
      group: 'main',
    }),
    defineField({
      name: 'currency',
      title: 'Moneda',
      type: 'string',
      options: {
        list: [
          { title: 'Soles (S/)', value: 'PEN' },
          { title: 'Dólares (US$)', value: 'USD' },
        ],
        layout: 'radio',
      },
      initialValue: 'USD',
      hidden: ({ parent }) => !parent?.price,
      group: 'main',
    }),
    defineField({
      name: 'priceOnRequest',
      title: 'Precio a consultar',
      type: 'boolean',
      initialValue: false,
      description: 'Si está activo, el precio se muestra como "Consultar" aunque haya un número guardado.',
      group: 'main',
    }),

    // ── Descripción ──
    defineField({
      name: 'excerpt',
      title: 'Resumen corto',
      type: 'text',
      rows: 2,
      description: 'Frase de 1–2 líneas que aparece en tarjetas y en meta description por defecto.',
      validation: (Rule) => Rule.required().max(220),
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Descripción completa',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Texto largo de la ficha. Describe ubicación exacta, entorno, usos, accesos.',
      group: 'main',
    }),

    // ── Ubicación ──
    defineField({
      name: 'distrito',
      title: 'Distrito / Zona',
      type: 'reference',
      to: [{ type: 'distrito' }],
      validation: (Rule) => Rule.required(),
      group: 'location',
    }),
    defineField({
      name: 'address',
      title: 'Dirección / sector',
      type: 'string',
      description: 'Opcional. Ej: "Urb. El Golf, Mz. B Lt. 5" o "Sector Las Lomas".',
      group: 'location',
    }),
    defineField({
      name: 'location',
      title: 'Coordenadas GPS',
      type: 'geopoint',
      description: 'Opcional pero recomendado — habilita el mapa en la ficha.',
      group: 'location',
    }),

    // ── Media ──
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
          ],
        },
      ],
      options: { layout: 'grid' },
      group: 'media',
    }),

    // ── Metadata de publicación ──
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'main',
    }),

    // ── SEO overrides ──
    defineField({
      name: 'seoTitle',
      title: 'Meta title (opcional)',
      type: 'string',
      description: 'Si se omite, se usa el título del terreno.',
      validation: (Rule) => Rule.max(70),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description (opcional)',
      type: 'text',
      rows: 3,
      description: 'Si se omite, se usa `excerpt`.',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen OG (opcional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Si se omite, se usa `coverImage`.',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Destacados primero, luego recientes',
      name: 'featuredThenDate',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
    {
      title: 'Recientes',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Precio menor a mayor',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Precio mayor a menor',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'distrito.name',
      status: 'status',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare({ title, subtitle, status, featured, media }) {
      const statusLabel: Record<string, string> = {
        disponible: '🟢',
        reservado: '🟡',
        vendido: '🔴',
      }
      return {
        title: `${featured ? '★ ' : ''}${title}`,
        subtitle: `${statusLabel[status] ?? ''} ${subtitle ?? 'Sin distrito'}`,
        media,
      }
    },
  },
})
