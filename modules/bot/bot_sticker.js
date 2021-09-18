const baileys = require('@adiwajshing/baileys')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const Jimp = require('jimp')
const webp = require('webp-converter')
const createExif = require('../create_exif')
const { MessageType, Mimetype } = baileys
const axios = require('../axios')
const mp4ToWebp = require('../mp4_to_webp')
const resizeVideo = require('../resize_video')
const addText = require('../add_text')
const db = require('../database')
const { DELAY, STICKER } = require('../../configs/bot')
const sendDonationMessage = require('../send_donation_message')
require('dotenv').config()
webp.grant_permission()

const stickerMiddleware = async (message, conn, type, callback) => {
  nextVideo = `/${message.key.remoteJid}/next_video`
  nextImage = `/${message.key.remoteJid}/next_image`
  const now = new Date()
  try {
    const nextSticker = new Date(
      type == 'video' ? db.getData(nextVideo) : db.getData(nextImage)
    )
    if (now.getTime() > nextSticker.getTime()) {
      throw 'Oke'
    }
    const delay = new Date(nextSticker.getTime() - now.getTime())
    const delayText = DELAY.ALERT(
      type == 'video' ? 'video' : 'gambar',
      delay.getMinutes(),
      delay.getSeconds()
    )
    await conn.sendMessage(message.key.remoteJid, delayText, MessageType.text)
    return
  } catch (e) {
    callback()
  }
}

module.exports = async (message, conn) => {
  if (
    message.message.imageMessage ||
    message.message.documentMessage ||
    message.message.videoMessage
  ) {
    if (message.message.imageMessage) {
      type = 'image'
    } else if (message.message.documentMessage) {
      if (message.message.documentMessage.mimetype == Mimetype.webp) {
        type = 'sticker'
      } else {
        type = 'document'
      }
    } else {
      type = 'video'
    }

    // Validate sticker.
    stickerMiddleware(message, conn, type, async () => {
      // Document must be image.
      if (type == 'document') {
        if (!message.message.documentMessage.mimetype.includes('image')) {
          return
        }
      }

      // Video must be less than or equal to 5 seconds
      if (type == 'video') {
        if (message.message.videoMessage.seconds > 5) {
          await conn.sendMessage(
            message.key.remoteJid,
            'Durasi video maksimal 5 detik',
            MessageType.text
          )
          return
        }
        await conn.sendMessage(
          message.key.remoteJid,
          'Video sedang diproses, harap menunggu.',
          MessageType.text
        )
      }

      let caption

      try {
        const uuid = uuidv4()
        const jid = message.key.remoteJid.split('@')[0]
        const fileName = jid + '-' + uuid
        const dir = type == 'video' ? './videos/' : './pictures/'

        // Download image or video from message.
        const originMediaSource = await conn.downloadAndSaveMediaMessage(
          message,
          dir + fileName
        )

        if (type == 'image' || type == 'document') {
          // Get caption.
          caption = message.message.imageMessage
            ? message.message.imageMessage.caption
            : null

          // Crop image.
          const croppedImageSource = dir + 'cropped-' + fileName + '.png'
          const image = await Jimp.read(originMediaSource)
          image.contain(500, 500)

          // Add caption.
          if (caption) {
            const font = await Jimp.loadFont(__basedir + '/assets/impact.fnt')
            image.print(
              font,
              10,
              caption.length > 13 ? 290 : 390,
              {
                text: caption,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_TOP
              },
              480
            )
          }

          await image.writeAsync(croppedImageSource)
          fs.unlinkSync(originMediaSource)

          // Convert to webp.
          webpImageSource = dir + fileName + '.webp'
          await webp.cwebp(croppedImageSource, webpImageSource, '-q 80')
          fs.unlinkSync(croppedImageSource)
        } else if (type == 'video') {
          // Get caption.
          caption = message.message.videoMessage.caption

          // Convert mp4 to webp.
          webpImageSource = dir + fileName + '.webp'
          const videoLink =
            process.env.BASE_URL + originMediaSource.substring(1)
          await mp4ToWebp(videoLink, webpImageSource)
          fs.unlinkSync(originMediaSource)

          // Resize webp.
          const webpLink = process.env.BASE_URL + webpImageSource.substring(1)
          await resizeVideo(webpLink, webpImageSource)

          // Add caption.
          if (caption) {
            await addText(webpLink, webpImageSource, caption)
          }
        } else if (type == 'sticker') {
          webpImageSource = originMediaSource
        }

        // Make sticker author and pack name.
        const exif = await createExif()
        await webp.webpmux_add(
          webpImageSource,
          webpImageSource,
          exif,
          'exif',
          (logging = '--')
        )
        fs.unlinkSync(exif)

        // Send sticker.
        await conn.sendMessage(
          message.key.remoteJid,
          { url: webpImageSource },
          MessageType.sticker,
          { mimetype: Mimetype.webp }
        )

        // Update delay.
        type == 'video'
          ? db.push(
              nextVideo,
              new Date(new Date().getTime() + 1000 * DELAY.VIDEO).getTime()
            )
          : db.push(
              nextImage,
              new Date(new Date().getTime() + 1000 * DELAY.IMAGE).getTime()
            )

        // Send donation message.
        await sendDonationMessage(message.key.remoteJid, conn)

        // Delete sticker for privacy :)
        fs.unlinkSync(webpImageSource)

        // Add record to API.
        axios.post('/bot/sticker', { jid: message.key.remoteJid })
      } catch (e) {
        await conn.sendMessage(
          message.key.remoteJid,
          STICKER.FAILED,
          MessageType.text
        )
        console.error(e)
      }
    })
  }
}
