import { boolean, index, text, timestamp } from 'drizzle-orm/pg-core'
import { createTable } from './common'

export const validatedAddressesTable = createTable(
  'validated_addresses',
  {
    address: text('address').primaryKey(),
    expireTime: timestamp('expire_time').notNull(),
    isCorrect: boolean('is_correct').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (address) => ({
    addressIndex: index('address_idx').on(address.address),
  }),
)

export type InsertAddress = typeof validatedAddressesTable.$inferInsert
export type SelectAddress = typeof validatedAddressesTable.$inferSelect
