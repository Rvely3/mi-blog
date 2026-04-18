'use client'

/**
 * Configuración del Sanity Studio embebido en /studio.
 * Ruta: app/studio/[[...tool]]/page.tsx
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// https://www.sanity.io/docs/api-versioning
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

// Tipos que son singletons (solo puede existir un documento).
const SINGLETONS = ['siteSettings'] as const

export default defineConfig({
  name: 'default',
  title: 'Terrenosentrujillo.pe',
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision permite correr GROQ dentro del Studio.
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Bloquea duplicar/eliminar en singletons.
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType as (typeof SINGLETONS)[number])
        ? input.filter(
            ({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action ?? ''),
          )
        : input,
    // No permitir crear nuevos documentos de tipos singleton desde el botón "+".
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(
            (t) => !SINGLETONS.includes(t.templateId as (typeof SINGLETONS)[number]),
          )
        : prev,
  },
})
