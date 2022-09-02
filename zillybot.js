#!/usr/bin/env node

const mineflayer = require('mineflayer')

const helper = require('./src/helpers')

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
  console.log(`${username}: ${message}`)
  if (username === bot.username) return
  bot.chat(message)
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)

bot.once('spawn', () => {
  console.log('spawned')
  bot.chat('chat test')
  console.log(bot.players)
  helper.printPlayerList(bot)
})

console.log(`connecting to ${process.env.SERVER_IP} ...`)
