const baileys = require('@adiwajshing/baileys')
const fs = require('fs')
const { WA_STATUS } = require('../commons/constants.js')
const states = require('../commons/states.js')
const bot_sticker = require('./bot/bot_sticker.js')
const sendDisconnectMail = require('./send_disconnect_mail.js')
const { WAConnection, DisconnectReason } = baileys
const { io } = require('../index')
const bot_intro = require('./bot/bot_intro.js')
const bot_quiz_quran = require('./bot/bot_quiz_quran.js')
const bot_quran = require('./bot/bot_quran.js')

// Init WA Connection.
const conn = new WAConnection()
conn.connectOptions.maxRetries = 30

// Load WA Authentication.
const tokenPath = './auth_info.json'
if (fs.existsSync(tokenPath)) {
  conn.loadAuthInfo(tokenPath)
}

conn.on('open', async () => {
  console.log('Credentials updated!')
  states.connection.status = WA_STATUS.CONNECTED
  states.connection.qrString = ''
  if (io) io.emit('NEW_STATUS', states.connection)
  const authInfo = conn.base64EncodedAuthInfo()
  fs.writeFileSync(tokenPath, JSON.stringify(authInfo, null, '\t'))
})

conn.on('qr', (qr) => {
  states.connection.qrString = qr
  if (io) io.emit('NEW_STATUS', states.connection)
})

conn.on('close', ({ reason, isReconnecting }) => {
  states.connection.status = WA_STATUS.DISCONNECTED
  states.connection.qrString = ''
  states.connection = {
    ...states.connection,
    reason,
    isReconnecting
  }

  if (reason == DisconnectReason.invalidSession) {
    if (fs.existsSync(tokenPath)) fs.unlinkSync(tokenPath)
    conn.clearAuthInfo()
  }

  if (io) io.emit('NEW_STATUS', states.connection)
  sendDisconnectMail(reason)
  conn.connect()
})

conn.on('chat-update', (chatUpdate) => {
  if (chatUpdate.messages && chatUpdate.count) {
    let messages = chatUpdate.messages.all()
    // For development mode.
    if (process.env.MODE == 'DEVELOPMENT') {
      messages = messages.filter(
        (message) => message.key.remoteJid == '6289653482393@s.whatsapp.net'
      )
      console.log(messages)
    }

    messages.forEach(async (message, index) => {
      if (message.key.remoteJid != 'status@broadcast') {
        bot_intro(message, conn, function () {
          bot_sticker(message, conn)
          bot_quiz_quran(message, conn)
          bot_quran(message, conn)
        })
      }
    })
  }
})

module.exports = conn
