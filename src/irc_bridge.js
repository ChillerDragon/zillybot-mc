const logger = require('./logger')
const irc = require('matrix-org-irc')

const serverName = () => {
  return process.env.IRC_SERVER.split('.')[1]
}

const connectionName = () => {
  return `${serverName()}#${process.env.IRC_CHANNEL}`
}

const initIrc = (zillyBot) => {
  if (zillyBot.irc) return
  // expect at least two dots in irc server otherwise assume irc is off
  if (process.env.IRC_SERVER.split('.').length < 2) return

  logger.log('bot', `connecting to irc server ${process.env.IRC_SERVER} (${serverName()}) ...`)
  zillyBot.irc = new irc.Client(process.env.IRC_SERVER, 'bridge', {
    channels: [`#${process.env.IRC_CHANNEL}`]
  })
  zillyBot.irc.addListener('error', function (message) {
    logger.log('irc', `Erorr: ${message.command}: ${message.args.join(' ')}`)
  })
  zillyBot.irc.addListener(`message#${process.env.IRC_CHANNEL}`, (from, message) => {
    // logger.log(`irc][${connectionName()}`, `${from}: ${message}`)
    zillyBot.mcChatDropSpam(`[${connectionName()}]${from}: ${message}`)
  })
}

const onMessage = (zillyBot, username, message) => {
  if (!zillyBot.irc) return
  if (username === zillyBot.mc.username && message.includes(connectionName())) return

  zillyBot.irc.say(`#${process.env.IRC_CHANNEL}`, `[mc]${username}: ${message}`)
}

module.exports = {
  onMessage,
  connectionName,
  initIrc
}
