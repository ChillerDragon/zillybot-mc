const { Command } = require('../command')

class ComBot extends Command {
  constructor (zillyBot) {
    super(zillyBot)
    this.names = ['bot']
    this.helpPages = ['Out as bot']
  }

  run (username, whisper, args) {
    this.whisper(username, '[iambot] My code is here: <https://github.com/ChillerDragon/zillybot-mc>')
  }
}

module.exports = {
  ComBot
}
