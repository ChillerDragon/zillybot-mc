const crypto = require('crypto')
const fs = require('fs')

const logger = require('./logger')

const ipHashMatch = (ip, hash) => {
  ip = ip.toLowerCase()
  hash = hash.toLowerCase()
  if (ip === hash) return true

  const sha256Base64 = crypto.createHash('sha256').update(ip).digest('base64')
  const sha256Hex = crypto.createHash('sha256').update(ip).digest('hex')
  const sha1Base64 = crypto.createHash('sha1').update(ip).digest('base64')
  const sha1Hex = crypto.createHash('sha1').update(ip).digest('hex')
  const md5Base64 = crypto.createHash('md5').update(ip).digest('base64')
  const md5Hex = crypto.createHash('md5').update(ip).digest('hex')

  if (sha256Base64 === hash) return true
  if (sha256Hex === hash) return true
  if (sha1Base64 === hash) return true
  if (sha1Hex === hash) return true
  if (md5Base64 === hash) return true
  if (md5Hex === hash) return true

  if (!ip.endsWith('\n')) {
    if (ipHashMatch(ip + '\n', hash)) {
      return true
    }
  }

  if (!ip.includes(':')) {
    if (ipHashMatch(ip + ':25565', hash)) {
      return true
    }
  }

  return false
}

const isValidHash = (hash) => {
  // sha256 hex
  if (/^[A-Fa-f0-9]{64}$/.test(hash)) return true
  // sha1 hex
  if (/^[A-Fa-f0-9]{40}$/.test(hash)) return true
  // md5 hex
  if (/^[A-Fa-f0-9]{32}$/.test(hash)) return true
  // sha256 base64
  if (/^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)$/.test(hash) && hash.length === 44) return true
  // sha1 base64
  if (/^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)$/.test(hash) && hash.length === 28) return true
  // md5 base64
  if (/^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)$/.test(hash) && hash.length === 24) return true

  return false
}

const onMessage = (bot, username, message) => {
  if (message[0] !== '!') return

  const input = message.slice(1).split(' ')
  const cmd = input[0]
  const args = input.length > 1 ? input.slice(1) : []
  logger.log('command', `'${username}' used command '${cmd}' with args: ${args}`)
  if (cmd.startsWith('help') || cmd.startsWith('info') || cmd.startsWith('about')) {
    bot.chat('I am a bot. My code is here: <https://github.com/ChillerDragon/zillybot-mc>')
  } else if (cmd.startsWith('bot')) { // !bot, !bots, !botter, !bothelp, !botinfo
    bot.chat('[iambot] My code is here: <https://github.com/ChillerDragon/zillybot-mc>')
  } else if (cmd === 'seed') {
    bot.chat(`the seed is: ${process.env.SEED}`)
  } else if (cmd === 'tps') {
    bot.chat('what e4t_ said.')
  } else if (cmd === 'checkhash' || cmd === 'hashcheck' || cmd === 'iphash' || cmd === 'honeyhash') {
    if (args.length !== 1) {
      bot.chat('usage: !checkhash <sha1 hashed server ip>')
      return
    }
    if (!isValidHash(args[0])) {
      bot.chat(`${username}: Error: invalid hash. Supported hashes are md5, sha1 and sha256.`)
      return
    }
    fs.readFile('./data/data.json', (err, dataText) => {
      if (err) {
        logger.logAndThrow(err)
      }
      const data = JSON.parse(dataText)
      let message = `${username}: Unkown hash probably a honeypot`
      data.validIps.forEach((valid) => {
        valid.ips.forEach((validIp) => {
          if (ipHashMatch(validIp, args[0])) {
            message = `${username}: this is a known legit ip (${valid.note})`
          }
        })
      })
      data.honeypots.forEach((honeypot) => {
        honeypot.ips.forEach((honeyIp) => {
          if (ipHashMatch(honeyIp, args[0])) {
            message = `${username}: this is a known honeypot ip (${honeypot.note})`
          }
        })
      })
      bot.chat(message)
    })
  }
}

module.exports = {
  onMessage
}
