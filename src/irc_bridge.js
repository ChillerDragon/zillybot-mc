const logger = require('./logger')
const irc = require('irc')

const serverName = () => {
  return process.env.IRC_SERVER.split('.')[1]
}

const connectionName = () => {
  return `${serverName()}#${process.env.IRC_CHANNEL}`
}

const initIrc = (bot) => {
  if (bot.irc) return
  // expect at least two dots in irc server otherwise assume irc is off
  if (process.env.IRC_SERVER.split('.').length < 2) return

  logger.log('bot', `connecting to irc server ${process.env.IRC_SERVER} (${serverName()}) ...`)
  bot.irc = new irc.Client(process.env.IRC_SERVER, 'bridge', {
    channels: [`#${process.env.IRC_CHANNEL}`]
  })
  bot.irc.addListener('error', function(message) {
    logger.log('irc', `Erorr: ${message.command}: ${message.args.join(' ')}`)
  })
  bot.irc.addListener(`message#${process.env.IRC_CHANNEL}`, (from, message) => {
    // logger.log(`irc][${connectionName()}`, `${from}: ${message}`)
    bot.chat(`[${connectionName()}]${from}: ${message}`)
  })
}

const onMessage = (bot, username, message) => {
  if (!bot.irc) return
  if (username === bot.username && message.includes(connectionName())) return

  bot.irc.say(`#${process.env.IRC_CHANNEL}`, `[mc]${username}: ${message}`)
}

module.exports = {
  onMessage,
  connectionName,
  initIrc
}
