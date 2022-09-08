const logger = require('./logger')
const helpers = require('./helpers')
const chatCommands = require('./chat_commands')
const ircBridge = require('./irc_bridge')

const initHooks = (bot) => {
  bot.on('chat', (username, message) => {
    logger.log('chat', `<${username}> ${message}`)
    ircBridge.onMessage(bot, username, message)
    if (username === bot.username) return
    if (message === 'chat test') bot.chat('uwu test')

    chatCommands.onMessage(bot, username, message)
  })

  bot.on('whisper', (username, message) => {
    logger.log('whisper', `${username}: ${message}`)
    bot.chat('I am a bot. My code is here: https://github.com/ChillerDragon/zillybot-mc')
  })

  // bot.on('message', (message) => {
  //   console.log(message)
  // })

  bot.on('messagestr', (messagestr, _position, message) => {
    if (message.translate === 'chat.type.text') return

    logger.log('message', messagestr)
  })

  // bot.on('playerJoined', (player) => {
  //   logger.log('server', `${player.username} joined the game`)
  // })

  // bot.on('playerLeft', (player) => {
  //   logger.log('server', `${player.username} left the game`)
  // })

  bot.once('spawn', () => {
    helpers.printPlayerList(bot)
  })

  bot.once('connect', () => {
    logger.log('bot', 'connected to server.')
  })
}

module.exports = {
  initHooks
}
