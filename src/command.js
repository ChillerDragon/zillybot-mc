class Command {
  constructor(zillyBot) {
    this.names = []
    this.zillyBot = zillyBot
  }

  mc() {
    return this.zillyBot.mc
  }

  chat(message) {
    this.mc().chat(message)
  }

  run(username, whisper, args) {
  }
}

module.exports = {
  Command
}
