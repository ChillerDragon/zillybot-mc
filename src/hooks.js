const logger = require('./logger')
const helpers = require('./helpers')
const chatCommands = require('./chat_commands')
const ircBridge = require('./irc_bridge')

const onChatMessage = (zillyBot, username, message) => {
  logger.log('chat', `<${username}> ${message}`)
  ircBridge.onMessage(zillyBot, username, message)
  if (username === zillyBot.mc.username) return
  if (message === 'chat test') zillyBot.mcChatDropSpam('uwu test')

  chatCommands.onMessage(zillyBot, username, message)
}

const initMcHooks = (zillyBot) => {
  zillyBot.mc.on('chat', (username, message) => {
    onChatMessage(zillyBot, username, message)
  })

  zillyBot.mc.on('whisper', (username, message) => {
    logger.log('whisper', `${username}: ${message}`)
    zillyBot.mcChatDropSpam(`/tell ${username} I am a bot. My code is here: <https://github.com/ChillerDragon/zillybot-mc>`)
  })

  zillyBot.mc.on('message', (message) => {
    // console.log(message)

    // support <HACKER | nametag>
    if (message.translate === 'chat.type.text') {
      if (message.with.length === 2) {
        if (message.with[0].text === 'HACKER' && message.with[0].extra) {
          if (message.with[0].extra.length === 2) {
            const username = message.with[0].extra[1]
            const chatMessage = message.with[1].text
            onChatMessage(zillyBot, username, chatMessage)
          }
        }
      }
    }
  })

  zillyBot.mc.on('messagestr', (messagestr, _position, message) => {
    if (message.translate === 'chat.type.text') return

    logger.log('message', messagestr)
  })

  // zillyBot.mc.on('playerJoined', (player) => {
  //   logger.log('server', `${player.username} joined the game`)
  // })

  // zillyBot.mc.on('playerLeft', (player) => {
  //   logger.log('server', `${player.username} left the game`)
  // })

  zillyBot.mc.once('spawn', () => {
    helpers.printPlayerList(zillyBot)
  })

  zillyBot.mc.once('connect', () => {
    logger.log('bot', 'connected to server.')
  })
}

module.exports = {
  initMcHooks
}
