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
  if (username === bot.username) return
  if (message === 'chat test') bot.chat('cat test UwU')
  if (message[0] !== '!') return

  const cmd = message.slice(1)
  if (cmd.startsWith('help') || cmd.startsWith('info')) {
    bot.chat('I am a bot. My code is here: https://github.com/ChillerDragon/zillybot-mc')
  }
})

bot.on('whisper', (username, message) => {
  logger.log('whisper', `${username}: ${message}`)
  bot.chat('I am a bot. My code is here: https://github.com/ChillerDragon/zillybot-mc')
})

bot.on('playerJoined', (player) => {
  logger.log('server', `${player.username} joined the game`)
})

bot.on('playerLeft', (player) => {
  logger.log('server', `${player.username} left the game`)
})

// Log errors and kick reasons:
bot.on('kicked', logger.log)
bot.on('error', logger.log)

bot.once('spawn', () => {
  helper.printPlayerList(bot)
})

bot.once('connect', () => {
  logger.log('bot', 'connected to server.')
})

logger.log('bot', `connecting to ${process.env.SERVER_IP} ...`)
