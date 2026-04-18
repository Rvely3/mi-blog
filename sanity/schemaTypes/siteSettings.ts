import { defineField, defineType } from 'sanity'

/**
 * Singleton con la configuración global del sitio.
 * Se edita desde /studio → "Configuración del sitio".
 * Sirve para no hardcodear WhatsApp, email, redes, datos legales, etc.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  // Es un singleton: se controla también desde structure.ts y document actions.
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nombre del sitio',
      type: 'string',
      initialValue: 'Terrenosentrujillo.pe',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Eslogan corto',
      type: 'string',
      description: 'Frase corta que acompaña al logo. Máx. 80 caracteres.',
      initialValue: 'Terrenos en Trujillo · La Libertad',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'defaultMetaTitle',
      title: 'Meta title por defecto',
      type: 'string',
      description: 'Se usa como fallback cuando una página no define su propio title.',
      initialValue: 'Terrenos en Trujillo | Terrenosentrujillo.pe',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Meta description por defecto',
      type: 'text',
      rows: 3,
      initialValue:
        'Encuentra terrenos en venta en Trujillo y La Libertad. Fichas con precio, área, ubicación y contacto directo con el corredor.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Imagen OG por defecto (1200x630)',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen para compartir en redes cuando una página no define la suya.',
    }),

    // Contacto
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (número internacional sin +)',
      type: 'string',
      description: 'Ejemplo: 51987654321. Se usará en el botón flotante y en los CTAs.',
      initialValue: '#####',
      validation: (Rule) =>
        Rule.regex(/^[0-9#]+$/, { name: 'solo dígitos o # como placeholder' }),
    }),
    defineField({
      name: 'whatsappDefaultMessage',
      title: 'Mensaje por defecto de WhatsApp',
      type: 'string',
      initialValue:
        'Hola, vi Terrenosentrujillo.pe y quisiera más información sobre sus terrenos.',
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      initialValue: 'contacto@terrenosentrujillo.pe',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono (opcional)',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Dirección física (opcional)',
      type: 'string',
      description: 'Aparece en footer y en JSON-LD LocalBusiness.',
    }),

    // Redes sociales
    defineField({
      name: 'socials',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
      ],
    }),

    // Legales
    defineField({
      name: 'legal',
      title: 'Datos legales',
      type: 'object',
      fields: [
        defineField({ name: 'companyName', title: 'Razón social', type: 'string' }),
        defineField({ name: 'ruc', title: 'RUC', type: 'string' }),
        defineField({
          name: 'brokerLicense',
          title: 'Licencia/registro de corredor (opcional)',
          type: 'string',
        }),
      ],
    }),

    // Analytics & verificaciones (IDs, no scripts completos)
    defineField({
      name: 'analytics',
      title: 'Analytics y verificaciones',
      type: 'object',
      fields: [
        defineField({
          name: 'ga4Id',
          title: 'Google Analytics 4 · Measurement ID',
          type: 'string',
          description: 'Ejemplo: G-XXXXXXXXXX',
        }),
        defineField({
          name: 'gscVerification',
          title: 'Google Search Console · Meta verification',
          type: 'string',
        }),
        defineField({
          name: 'metaPixelId',
          title: 'Meta Pixel ID (opcional)',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configuración del sitio' }),
  },
})
