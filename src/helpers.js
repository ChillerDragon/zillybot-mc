const logger = require('./logger')

const printPlayerList = (bot) => {
  const width = 30
  logger.log('players', `+-${Array(width).join('-')}-+`)
  for (const player of Object.values(bot.players)) {
    const padding = player.username.length > width ? 0 : width - player.username.length
    logger.log('players', `| ${player.username}${Array(padding).join(' ')} |`)
  }
  logger.log('players', `+-${Array(width).join('-')}-+`)
}

module.exports = {
  printPlayerList
}
