import 'server-only'
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Cliente de Sanity con permisos de ESCRITURA.
 *
 * SOLO se importa en Server Actions o Route Handlers. El token nunca debe
 * salir al bundle del cliente; `server-only` hace fallar el build si alguien
 * lo importa desde un Client Component por error.
 *
 * El token se lee desde `SANITY_API_WRITE_TOKEN` (crear en
 * manage.sanity.io → API → Tokens → Editor).
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false, // escrituras nunca pasan por CDN
})
