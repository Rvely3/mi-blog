import type { StructureResolver } from 'sanity/structure'

/**
 * Navegación del Studio de Sanity.
 *
 * Orden y agrupación:
 *   1. Configuración del sitio (singleton pinneado)
 *   2. Terrenos (con filtros por estado y destacados)
 *   3. Distritos
 *   4. Blog
 *
 * Ref: https://www.sanity.io/docs/structure-builder-cheat-sheet
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // ── Configuración global ──
      S.listItem()
        .title('Configuración del sitio')
        .id('siteSettings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Configuración del sitio'),
        ),

      S.divider(),

      // ── Terrenos ──
      S.listItem()
        .title('Terrenos')
        .icon(() => '🏷')
        .child(
          S.list()
            .title('Terrenos')
            .items([
              S.listItem()
                .title('Todos')
                .child(
                  S.documentTypeList('terreno')
                    .title('Todos los terrenos')
                    .defaultOrdering([
                      { field: 'featured', direction: 'desc' },
                      { field: 'publishedAt', direction: 'desc' },
                    ]),
                ),
              S.listItem()
                .title('Destacados')
                .child(
                  S.documentList()
                    .title('Destacados')
                    .schemaType('terreno')
                    .filter('_type == "terreno" && featured == true')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Disponibles')
                .child(
                  S.documentList()
                    .title('Disponibles')
                    .schemaType('terreno')
                    .filter('_type == "terreno" && status == "disponible"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Reservados')
                .child(
                  S.documentList()
                    .title('Reservados')
                    .schemaType('terreno')
                    .filter('_type == "terreno" && status == "reservado"'),
                ),
              S.listItem()
                .title('Vendidos')
                .child(
                  S.documentList()
                    .title('Vendidos')
                    .schemaType('terreno')
                    .filter('_type == "terreno" && status == "vendido"'),
                ),
            ]),
        ),

      // ── Distritos ──
      S.listItem()
        .title('Distritos')
        .icon(() => '📍')
        .child(
          S.documentTypeList('distrito')
            .title('Distritos')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),

      S.divider(),

      // ── Blog ──
      S.listItem()
        .title('Blog')
        .icon(() => '📝')
        .child(
          S.documentTypeList('post')
            .title('Artículos')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),

      S.divider(),

      // ── Leads (formulario de contacto) ──
      S.listItem()
        .title('Leads')
        .icon(() => '📨')
        .child(
          S.list()
            .title('Leads')
            .items([
              S.listItem()
                .title('Nuevos')
                .child(
                  S.documentList()
                    .title('Leads nuevos')
                    .schemaType('lead')
                    .filter('_type == "lead" && status == "nuevo"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('En proceso')
                .child(
                  S.documentList()
                    .title('Leads en proceso')
                    .schemaType('lead')
                    .filter(
                      '_type == "lead" && (status == "contactado" || status == "en_proceso")',
                    )
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Todos')
                .child(
                  S.documentTypeList('lead')
                    .title('Todos los leads')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }]),
                ),
            ]),
        ),
    ])
