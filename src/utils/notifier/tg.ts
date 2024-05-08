import TelegramBot from 'node-telegram-bot-api'
import { log } from '@/utils/notifier/log'
import { env } from '@/env'

const bot = env.TG_TOKEN ? new TelegramBot(env.TG_TOKEN, { polling: true }) : null

const chats = new Set<number>()

if (bot) {
  bot.onText(/\/start$/, (msg) => {
    const chatId = msg.chat.id
    chats.add(chatId)
    bot.sendMessage(chatId, 'Welcome to CKB Metrics!')
  })
}

export const notify = (address: string, message: string) => {
  log(address, message)
  if (!bot) return
  const msg = `[LOG] ${address}: ${message}\nhttps://explorer.nervos.org/address/${address}`

  chats.forEach((id) => {
    bot.sendMessage(id, msg)
  })
}

export { bot }
