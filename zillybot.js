#!/usr/bin/env node

const prompt = require('prompt')
const mineflayer = require('mineflayer')

const ircBridge = require('./src/irc_bridge')
const logger = require('./src/logger')
const { initMcHooks } = require('./src/hooks')

const { ComSeed } = require('./src/commands/seed')
const { ComVerifyHash } = require('./src/commands/verify_hash')
const { ComTps } = require('./src/commands/tps')
const { ComBot } = require('./src/commands/bot')
const { ComCmdlist } = require('./src/commands/cmdlist')

require('dotenv').config()

prompt.start()

class ZillyBot {
  constructor () {
    this.mc = null
    this.irc = null
    this.lastMcChatSent = new Date()
    this.commands = []
    this.commands.push(new ComSeed(this))
    this.commands.push(new ComVerifyHash(this))
    this.commands.push(new ComTps(this))
    this.commands.push(new ComBot(this))
    this.commands.push(new ComCmdlist(this))
  }

  mcChatDropSpam (message) {
    if (this.mc === null) return

    const now = new Date()
    const diffMs = now - this.lastMcChatSent
    if (diffMs < 400) return

    this.lastMcChatSent = new Date()
    this.mc.chat(message)
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

  // const _super = zillyBot.mc._client.write
  // _super(packName, params)

  // zillyBot.mc._client.write = (packName, params) => {
  //   const _this = zillyBot.mc._client
  //   // console.log(_this)
  //   // if (!_this.serializer.writable) { return }
  //   // if (packName === 'position_look' || packName === 'position') { return }
  //   _this.serializer.write({ packName, params })
  // }

  // console.log(zillyBot.mc._client.write)

  logger.log('bot', `connecting to minecraft server ${process.env.SERVER_IP} ...`)
  ircBridge.initIrc(zillyBot)

  initMcHooks(zillyBot)
  // zillyBot.mc.once('disconnect', () => reconnect(zillyBot))
  zillyBot.mc.on('kicked', (reason) => reconnect(reason, zillyBot))
  zillyBot.mc.on('error', (reason) => reconnect(reason, zillyBot))

  zillyBot.mc._client.on('position', (packet) => {
    // packet.z = Math.round(packet.z * 1000) / 1000
    // packet.x = Math.floor(packet.x) + 0.5
    // packet.z = Math.floor(packet.z) + 0.5
    packet.x = Math.floor(packet.x) + 1.7
    packet.z = Math.floor(packet.z) + 1.7
    packet.onGround = true
    zillyBot.mc._client.write('position', packet)
  })
}

const zillyBot = new ZillyBot()
connect(zillyBot)
zillyBot.getInput()
