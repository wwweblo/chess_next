import { type SchemaTypeDefinition } from 'sanity'
import { user } from './user'
import { post } from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, post],
}
