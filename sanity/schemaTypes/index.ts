import { type SchemaTypeDefinition } from 'sanity'

import siteSettings from './siteSettings'
import distrito from './distrito'
import terreno from './terreno'
import post from './post'
import lead from './lead'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, distrito, terreno, post, lead],
}
