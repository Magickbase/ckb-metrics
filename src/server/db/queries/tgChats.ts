import { eq } from 'drizzle-orm'
import { db } from '@/server/db'
import { tgChatsTable } from '@/server/db/schema'

export const getChats = async () => {
  return db.select().from(tgChatsTable)
}

export const addChat = async (chatId: number) => {
  return db.insert(tgChatsTable).values({ chatId }).onConflictDoNothing()
}

export const deleteChat = async (chatId: number) => {
  return db.delete(tgChatsTable).where(eq(tgChatsTable.chatId, chatId))
}
