import { defineField, defineType } from 'sanity'

/**
 * Distrito / zona de Trujillo.
 *
 * Se usa como hub SEO (`/terrenos/zona/[slug]`) y como referencia desde
 * cada `terreno`. Cada distrito debe tener contenido único para que
 * Google no lo trate como thin content.
 */
export default defineType({
  name: 'distrito',
  title: 'Distrito / Zona',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del distrito',
      type: 'string',
      description: 'Ej: Huanchaco, Víctor Larco Herrera, Trujillo (centro).',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'text',
      rows: 2,
      description:
        'Frase de 1–2 líneas que resume el distrito. Aparece en tarjetas y en la home.',
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: 'description',
      title: 'Descripción SEO (larga)',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Contenido único sobre el distrito para posicionar: ubicación, demanda, tipo de terrenos, accesos, crecimiento urbano, etc.',
    }),
    defineField({
      name: 'image',
      title: 'Imagen del distrito',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Describe la imagen para SEO y accesibilidad.',
        }),
      ],
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas centrales',
      type: 'geopoint',
      description: 'Centro del distrito, para centrar mapas cuando aplique.',
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Menor = aparece primero. Usado para ordenar listados manualmente.',
      initialValue: 100,
    }),

    // SEO overrides
    defineField({
      name: 'seoTitle',
      title: 'Meta title (opcional)',
      type: 'string',
      description: 'Si se omite, se genera automáticamente desde el nombre.',
      validation: (Rule) => Rule.max(70),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description (opcional)',
      type: 'text',
      rows: 3,
      description: 'Si se omite, se usa `shortDescription`.',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
  ],
  groups: [{ name: 'seo', title: 'SEO' }],
  orderings: [
    {
      title: 'Orden manual',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Nombre A→Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'shortDescription',
      media: 'image',
    },
  },
})
