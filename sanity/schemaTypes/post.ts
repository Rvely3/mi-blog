import { defineField, defineType } from 'sanity'

/**
 * Artículo del blog.
 *
 * El blog es apoyo SEO para posicionar por intenciones informativas
 * ("cómo comprar terreno en Trujillo", "mejores zonas para invertir", etc.)
 * y generar enlazado interno hacia fichas de terreno y hubs de distrito.
 *
 * En Fase 2 mantenemos las categorías como array de strings con lista
 * predefinida (suficiente para MVP). Si en el futuro queremos hubs
 * `/blog/categoria/[slug]`, migramos a un schema `categoriaBlog` con
 * referencias.
 */
export default defineType({
  name: 'post',
  title: 'Artículo',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: 'excerpt',
      title: 'Descripción corta (SEO)',
      type: 'text',
      rows: 3,
      description: 'Se usa también como meta description por defecto.',
      validation: (Rule) => Rule.max(160),
      group: 'main',
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
      ],
      group: 'main',
    }),
    defineField({
      name: 'categorias',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Comprar terreno', value: 'comprar-terreno' },
          { title: 'Inversión', value: 'inversion' },
          { title: 'Zonas de Trujillo', value: 'zonas' },
          { title: 'Trámites y legal', value: 'tramites' },
          { title: 'Financiamiento', value: 'financiamiento' },
          { title: 'Guías y tutoriales', value: 'guias' },
        ],
      },
      group: 'main',
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
          ],
        },
      ],
      group: 'main',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'main',
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      group: 'main',
    }),

    // SEO overrides
    defineField({
      name: 'seoTitle',
      title: 'Meta title (opcional)',
      type: 'string',
      description: 'Si se omite, se usa el título del artículo.',
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
      title: 'Recientes primero',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'coverImage',
    },
  },
})
