const { Command } = require('../command')

class ComSeed extends Command {
  constructor (zillyBot) {
    super(zillyBot)
    this.names = ['seed']
    this.helpPages = ['shows the world seed']
  }

  run (username, whisper, args) {
    this.chat(`the seed is: ${process.env.SEED}`)
  }
}

module.exports = {
  ComSeed
}
