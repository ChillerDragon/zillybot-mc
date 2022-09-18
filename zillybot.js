#!/usr/bin/env node

const prompt = require('prompt')
const mineflayer = require('mineflayer')

const ircBridge = require('./src/irc_bridge')
const logger = require('./src/logger')
const { initMcHooks } = require('./src/hooks')

const { ComSeed } = require('./src/commands/seed')

require('dotenv').config()

prompt.start()

class ZillyBot {
  constructor () {
    this.mc = null
    this.irc = null
    this.commands = []
    this.commands.push(new ComSeed(this))
  }

  getInput () {
    prompt.get(['chat'], (err, result) => {
      if (err) {
        logger.logAndThrow(err)
      }

      this.mc.chat(result.chat)
      this.getInput()
    })
  }
}

const reconnect = (msg, zillyBot) => {
  const delay = 10
  logger.log('bot', `Got disconnect: ${msg}`)
  logger.log('bot', `reconnecting in ${delay} seconds ...`)
  setTimeout(() => {
    connect(zillyBot)
  }, 1000 * delay)
}

const connect = (zillyBot) => {
  zillyBot.mc = mineflayer.createBot({
    host: process.env.SERVER_IP,
    username: process.env.MC_USERNAME,
    password: process.env.MC_PASSWORD,
    port: process.env.SERVER_PORT,
    version: '1.18.2',
    auth: 'microsoft'
  })

  logger.log('bot', `connecting to minecraft server ${process.env.SERVER_IP} ...`)
  ircBridge.initIrc(zillyBot)

  initMcHooks(zillyBot)
  // zillyBot.mc.once('disconnect', () => reconnect(zillyBot))
  zillyBot.mc.on('kicked', (reason) => reconnect(reason, zillyBot))
  zillyBot.mc.on('error', (reason) => reconnect(reason, zillyBot))
}

const zillyBot = new ZillyBot()
connect(zillyBot)
zillyBot.getInput()
