const logger = require('./logger')

const onMessage = (zillyBot, username, message) => {
  if (message[0] !== '!') return

  const fullCommand = message.slice(1)
  const input = fullCommand.split(' ')
  const cmd = input[0]
  const args = input.length > 1 ? input.slice(1) : []
  logger.log('command', `'${username}' used command '${cmd}' with args: ${args}`)
  // TODO: move this to commands/help.js
  if (fullCommand.startsWith('help ')) {
    const helpData = fullCommand.split(' ').slice(1)
    if (helpData.length < 1) return

    const helpCmd = helpData[0]
    const helpPage = helpData.length < 2 ? 0 : Number.parseInt(helpData[1], 10)

    zillyBot.commands.forEach((com) => {
      if (com.names.includes(helpCmd)) {
        com.help(helpPage - 1)
      }
    })
  } else if (cmd.startsWith('help') || cmd.startsWith('info') || cmd.startsWith('about')) {
    zillyBot.mc.chat('Checkout !cmdlist and the code at <https://github.com/ChillerDragon/zillybot-mc>')
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
