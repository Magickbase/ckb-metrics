import TelegramBot from 'node-telegram-bot-api'
import { addChat, deleteChat, getChats } from '@/server/db/queries/tgChats'
import { env } from '@/env'

const bot = env.TG_TOKEN ? new TelegramBot(env.TG_TOKEN, { polling: true }) : null

if (bot) {
  bot.onText(/\/subscribe$/, async (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Welcome to CKB Metrics!')
    await addChat(chatId)
  })

  bot.onText(/\/unsubscribe$/, async (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Goodbye!')
    await deleteChat(chatId)
  })
}

export const notify = async (address: string, message: string) => {
  if (!bot) return
  const msg = `[LOG] ${address}: ${message}\nhttps://explorer.nervos.org/address/${address}`

  const chatIds = await getChats()
  chatIds.forEach(({ chatId }) => {
    bot.sendMessage(chatId, msg)
  })
}

export { bot }
