const logger = require('./logger')

const onMessage = (zillyBot, username, message) => {
  if (message[0] !== '!') return

  const input = message.slice(1).split(' ')
  const cmd = input[0]
  const args = input.length > 1 ? input.slice(1) : []
  logger.log('command', `'${username}' used command '${cmd}' with args: ${args}`)
  if (cmd.startsWith('help') || cmd.startsWith('info') || cmd.startsWith('about')) {
    zillyBot.mc.chat('I am a bot. My code is here: <https://github.com/ChillerDragon/zillybot-mc>')
  } else if (cmd.startsWith('bot')) { // !bot, !bots, !botter, !bothelp, !botinfo
    zillyBot.mc.chat('[iambot] My code is here: <https://github.com/ChillerDragon/zillybot-mc>')
  } else if (cmd === 'tps') {
    zillyBot.mc.chat('what e4t_ said.')
  } else {
    zillyBot.commands.forEach((com) => {
      if (com.names.includes(cmd)) {
        com.run(username, false, args)
      }
    })
  }
}

module.exports = {
  onMessage
}
