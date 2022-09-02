#!/usr/bin/env node

const mineflayer = require('mineflayer')

const helper = require('./src/helpers')
const logger = require('./src/logger')

require('dotenv').config()

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP,
  username: process.env.MC_USERNAME,
  password: process.env.MC_PASSWORD,
  // port: 25565,
  // version: false,
  auth: 'microsoft'
})

bot.on('chat', (username, message) => {
  logger.log('chat', `${username}: ${message}`)
  // if (username === bot.username) return
  // bot.chat(message)
})

// Log errors and kick reasons:
bot.on('kicked', logger.log)
bot.on('error', logger.log)

bot.once('spawn', () => {
  logger.log('bot', 'spawned')
  helper.printPlayerList(bot)
})

logger.log('bot', `connecting to ${process.env.SERVER_IP} ...`)
