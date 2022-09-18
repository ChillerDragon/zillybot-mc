const { Command } = require('../command')

class ComSeed extends Command {
  constructor(zillyBot) {
    super(zillyBot)
    this.names = ['seed']
  }
  run(username, whisper, args) {
    this.mc.chat(`the seed is: ${process.env.SEED}`)
  }
}

module.exports = {
  ComSeed
}