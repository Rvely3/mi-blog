import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, post],
}
