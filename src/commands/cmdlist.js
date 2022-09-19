const { Command } = require('../command')

class ComCmdlist extends Command {
  constructor (zillyBot) {
    super(zillyBot)
    this.names = ['cmdlist', 'cmds', 'commands']
    this.helpPages = ['Shows all chat commands the bot offers']
    this.cmdPages = null
  }

  getCmdPages () {
    // cache
    if (this.cmdPages !== null) return this.cmdPages

    let cmdPage = ''
    this.cmdPages = []
    const maxPageLen = 128

    this.zillyBot.commands.forEach((com) => {
      if (cmdPage.length + com.names[0].length + 2 > maxPageLen) {
        this.cmdPages.push(cmdPage)
        cmdPage = com.names[0]
        return
      }

      if (cmdPage === '') {
        cmdPage += com.names[0]
      } else {
        cmdPage += ', ' + com.names[0]
      }
    })
    this.cmdPages.push(cmdPage)
    return this.cmdPages
  }

  run (username, whisper, args) {
    let page = args.length > 0 ? Number.parseInt(args[0], 10) - 1 : 0
    if (page < 0) page = 0
    if (page >= this.getCmdPages().length) page = this.getCmdPages().length - 1
    const pageInfo = `[page ${page + 1}/${this.getCmdPages().length}]`
    const cmdPage = `${this.getCmdPages()[page]} ${pageInfo}`
    if (whisper) {
      this.chat(`/tell ${username} ${cmdPage}`)
    } else {
      this.chat(cmdPage)
    }
  }
}

module.exports = {
  ComCmdlist
}
