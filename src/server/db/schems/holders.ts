import { text, json, index, timestamp } from 'drizzle-orm/pg-core'
import { createTable } from './common'

export const holdersTable = createTable(
  'holders',
  {
    typeHash: text('type_hash').primaryKey(),
    codeHash: text('code_hash').notNull(),
    hashType: text('hash_type').notNull(),
    args: text('args').notNull(),
    holders: json('holders').notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  },
  (holders) => ({
    typeHashIndex: index('type_hash_idx').on(holders.typeHash),
  }),
)
