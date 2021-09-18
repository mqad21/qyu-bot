const { MessageType } = require('@adiwajshing/baileys')
const { INTRO, KEYWORDS } = require('../../configs/bot')
const db = require('../database')
require('dotenv').config()

const sendIntroMessage = async (conn, jid) => {
  await conn.sendMessage(jid, INTRO.MESSAGE, MessageType.text)
}

const sendGuideMessage = async (conn, jid) => {
  await conn.sendMessage(jid, { url: INTRO.GUIDE.POSTER }, MessageType.image, {
    caption: INTRO.GUIDE.TEXT
  })
}

module.exports = async (message, conn, callback) => {
  // For development mode.
  if (process.env.MODE == 'DEVELOPMENT') {
    return callback()
  }

  const jid = message.key.remoteJid
  const now = new Date()

  try {
    const last_use = new Date(db.getData(`/${jid}/last_use`))
    if (last_use.toDateString() != now.toDateString()) {
      throw 'Oke'
    }
    callback()
  } catch (e) {
    if (message.message.conversation == KEYWORDS.INTRO) {
      db.push(`/${jid}/last_use`, now.getTime())
      db.push(`/${jid}/count`, 0)

      await sendIntroMessage(conn, jid)
      await sendGuideMessage(conn, jid)
    } else {
      await conn.sendMessage(jid, INTRO.ERROR.TEXT, MessageType.text)
    }
  }
}
