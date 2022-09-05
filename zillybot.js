#!/usr/bin/env node

const prompt = require('prompt')
const mineflayer = require('mineflayer')

const logger = require('./src/logger')
const { initHooks } = require('./src/hooks')

require('dotenv').config()

prompt.start()

const getChatInput = (bot) => {
  prompt.get(['chat'], (err, result) => {
    if (err) {
      logger.logAndThrow(err)
    }

    bot.chat(result.chat)
    getChatInput(bot)
  })
}

const reconnect = (msg) => {
  const delay = 10
  logger.log('bot', `Got disconnect: ${msg}`)
  logger.log('bot', `reconnecting in ${delay} seconds ...`)
  setTimeout(connect, 1000 * delay)
}

const connect = () => {
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
  bot.once('disconnect', reconnect)
  bot.on('kicked', reconnect)
  bot.on('error', reconnect)
  getChatInput(bot)
}

connect()
