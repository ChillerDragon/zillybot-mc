class Command {
  constructor(zillyBot) {
    this.names = []
    this.zillyBot = zillyBot
    this.mc = zillyBot.mc
  }

  run(username, whisper, args) {
  }
}

module.exports = {
  Command
}
