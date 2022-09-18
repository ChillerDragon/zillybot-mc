const { Command } = require('../command')

class ComTps extends Command {
  constructor (zillyBot) {
    super(zillyBot)
    this.names = ['tps']
    this.helpPages = ['shows the server ticks per second']
  }

  run (username, whisper, args) {
    this.chat('tps')
  }
}

module.exports = {
  ComTps
}
