import type { StructureResolver } from 'sanity/structure'

/**
 * Navegación del Studio.
 * - `siteSettings` se pinnea como singleton al tope.
 * - El resto se lista automáticamente (por ahora: post).
 *
 * Ref: https://www.sanity.io/docs/structure-builder-cheat-sheet
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Configuración del sitio')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Configuración del sitio'),
        ),
      S.divider(),
      // Resto de tipos (post, y en el futuro: terreno, distrito, etc.)
      ...S.documentTypeListItems().filter(
        (listItem) => !['siteSettings'].includes(listItem.getId() ?? ''),
      ),
    ])
