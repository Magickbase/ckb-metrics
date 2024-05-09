import TelegramBot from 'node-telegram-bot-api'
import { env } from '@/env'
import { db, Tables } from '@/server/db'

const bot = env.TG_TOKEN ? new TelegramBot(env.TG_TOKEN, { polling: true }) : null

// const chats = new Set<number>()

if (bot) {
  bot.onText(/\/subscribe$/, async (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Welcome to CKB Metrics!')
    await db.from(Tables.TgChats).upsert({ id: chatId })
  })

  bot.onText(/\/unsubscribe$/, async (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Goodbye!')
    await db.from(Tables.TgChats).delete().eq('id', chatId)
  })
}

export const notify = async (address: string, message: string) => {
  if (!bot) return
  const msg = `[LOG] ${address}: ${message}\nhttps://explorer.nervos.org/address/${address}`

  const chatIds = await db.from(Tables.TgChats).select('id')
  chatIds.data?.forEach(({ id }) => {
    bot.sendMessage(id, msg)
  })
}

export { bot }
