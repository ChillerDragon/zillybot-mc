/* ChillerDragon's logger */

const fs = require('fs')

const log = (type, msg) => {
  const ts = new Date().toISOString().split('T').join(' ').split(':').join(':').split('.')[0]
  const logmsg = `[${ts}][${type}] ${msg}`
  console.log(logmsg)
  logToFile(type, msg)
}

const logToFile = (type, msg) => {
  const ts = new Date().toISOString().split('T').join(' ').split(':').join(':').split('.')[0]
  const logmsg = `[${ts}][${type}] ${msg}`
  fs.appendFile('logs/logfile.txt', logmsg + '\n', (err) => {
    if (err) {
      throw err
    }
  })
}

const logAndThrow = (err) => {
  logToFile('error', err)
  throw err
}

module.exports = {
  log,
  logToFile,
  logAndThrow
}
