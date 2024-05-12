import { integer } from 'drizzle-orm/pg-core'
import { createTable } from './common'

export const tgChatsTable = createTable('tg_chats', {
  chatId: integer('chat_id').primaryKey(),
})

export type SelectTgChat = typeof tgChatsTable.$inferSelect
export type InsertTgChat = typeof tgChatsTable.$inferInsert
