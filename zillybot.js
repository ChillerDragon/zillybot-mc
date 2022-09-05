#!/usr/bin/env node

const prompt = require('prompt')
const mineflayer = require('mineflayer')

const logger = require('./src/logger')
const { initHooks } = require('./src/hooks')

require('dotenv').config()

prompt.start()

class ChatPrompt {
  setBot (bot) {
    this.bot = bot
  }

  getInput () {
    prompt.get(['chat'], (err, result) => {
      if (err) {
        logger.logAndThrow(err)
      }

      this.bot.chat(result.chat)
      this.getInput()
    })
  }
}

const reconnect = (msg, chatPrompt) => {
  const delay = 10
  logger.log('bot', `Got disconnect: ${msg}`)
  logger.log('bot', `reconnecting in ${delay} seconds ...`)
  setTimeout(() => {
    connect(chatPrompt)
  }, 1000 * delay)
}

const connect = (chatPrompt) => {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    username: process.env.MC_USERNAME,
    password: process.env.MC_PASSWORD,
    // port: 25565,
    // version: false,
    auth: 'microsoft'
  })

  logger.log('bot', `connecting to ${process.env.SERVER_IP} ...`)

  initHooks(bot)
  // bot.once('disconnect', () => reconnect(chatPrompt))
  bot.on('kicked', (reason) => reconnect(reason, chatPrompt))
  bot.on('error', (reason) => reconnect(reason, chatPrompt))

  chatPrompt.setBot(bot)
}

const chatPrompt = new ChatPrompt()
connect(chatPrompt)
chatPrompt.getInput()
