import { get, set } from '@/server/db'

const CHATS_KEY = 'telegram_chats'

export const getChats = async (): Promise<number[]> => {
  const chats = await get(CHATS_KEY)
  return chats || []
}

export const addChat = async (chatId: number) => {
  const chats = await getChats()
  if (!chats.includes(chatId)) {
    chats.push(chatId)
    await set(CHATS_KEY, chats)
  }
  return true
}

export const deleteChat = async (chatId: number) => {
  const chats = await getChats()
  const filteredChats = chats.filter((id) => id !== chatId)
  await set(CHATS_KEY, filteredChats)
  return true
}
