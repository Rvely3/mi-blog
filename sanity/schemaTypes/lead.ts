import { defineField, defineType } from 'sanity'

/**
 * Documento Lead — se crea automáticamente desde el formulario de /contacto.
 * No está pensado para edición manual en Studio, pero se lista ahí para que
 * el corredor pueda revisar, marcar como contactado o descartar cada lead.
 */
export default defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  // El form de contacto crea los documentos; el Studio solo los gestiona.
  readOnly: false,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) =>
        Rule.required().email().error('Ingresa un email válido'),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      description: 'Opcional',
    }),
    defineField({
      name: 'message',
      title: 'Mensaje',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(5).max(2000),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Nuevo', value: 'nuevo' },
          { title: 'Contactado', value: 'contactado' },
          { title: 'En proceso', value: 'en_proceso' },
          { title: 'Cerrado', value: 'cerrado' },
          { title: 'Descartado', value: 'descartado' },
        ],
        layout: 'radio',
      },
      initialValue: 'nuevo',
    }),
    defineField({
      name: 'source',
      title: 'URL de origen',
      type: 'string',
      description: 'Página desde donde se envió el formulario',
      readOnly: true,
    }),
    defineField({
      name: 'userAgent',
      title: 'User agent',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de envío',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Notas internas',
      type: 'text',
      rows: 3,
      description: 'Para uso del corredor, no se envía al usuario',
    }),
  ],
  orderings: [
    {
      name: 'createdAtDesc',
      title: 'Más recientes primero',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      name: 'statusThenDate',
      title: 'Estado, luego fecha',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'createdAt', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      status: 'status',
      createdAt: 'createdAt',
    },
    prepare({ name, email, status, createdAt }) {
      const icon =
        status === 'nuevo'
          ? '🟢'
          : status === 'contactado'
            ? '🟡'
            : status === 'cerrado'
              ? '✅'
              : status === 'descartado'
                ? '⚪'
                : '🔵'
      const date = createdAt
        ? new Date(createdAt).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
          })
        : ''
      return {
        title: `${icon} ${name || 'Sin nombre'}`,
        subtitle: `${date} · ${email || '—'}`,
      }
    },
  },
})
