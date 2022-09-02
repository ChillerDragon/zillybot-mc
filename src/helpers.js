const printPlayerList = (bot) => {
  const width = 30
  console.log(`+-${Array(width).join('-')}-+`)
  for (const player of Object.values(bot.players)) {
    const padding = player.username.length > width ? 0 : width - player.username.length
    console.log(`| ${player.username}${Array(padding).join(' ')} |`)
  }
  console.log(`+-${Array(width).join('-')}-+`)
}

module.exports = {
  printPlayerList
}
