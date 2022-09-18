class Command {
  constructor (zillyBot) {
    this.names = []
    this.helpPages = ['TODO']
    this.zillyBot = zillyBot
  }

  help (page) {
    if (page < 0) page = 0
    if (page >= this.helpPages.length) page = this.helpPages.length - 1
    if (this.helpPages.length === 0) return

    let helpText = this.helpPages[page]
    if (this.helpPages.length > 1) {
      helpText += ` [page ${page + 1}/${this.helpPages.length}]`
    }
    this.chat(helpText)
  }

  mc () {
    return this.zillyBot.mc
  }

  whisper (username, message) {
    this.chat(`/tell ${username} ${message}`)
  }

  chat (message) {
    this.mc().chat(message)
  }

  run (username, whisper, args) {
  }
}

module.exports = {
  Command
}
