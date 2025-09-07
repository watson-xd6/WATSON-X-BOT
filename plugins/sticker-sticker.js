import { sticker, addExif } from '../lib/sticker.js'
import { ryzenCDN } from '../lib/uploadFile.js'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    if (/video/g.test(mime)) {
      if ((q.msg || q).seconds > 10) return m.reply('Maximum 10 seconds')
      let img = await q.download?.()
      if (!img) throw `Failed to upload video *${usedPrefix + command}*`
      let stiker = false
      try {
        stiker = await sticker(img, false, global.stickpack, global.stickauth)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          let out = await ryzenCDN(img)
          if (!out?.url) throw 'Failed to upload video'
          stiker = await sticker(false, out.url, global.stickpack, global.stickauth)
        }
      }
      conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, null)
    } else if (/image/g.test(mime)) {
      let [packname, ...author] = args.join` `.split`|`
      author = (author || []).join`|`
      let img = await q.download?.()
      let stiker = false
      try {
        let pack = global.stickpack
        let author = global.stickauth
        stiker = await addExif(img, pack, author)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          stiker = await createSticker(img, false, packname, author)
        }
      }
      m.reply(stiker)
    } else {
      m.reply('Unknown media type')
    }
  } catch (e) {
    console.error(e)
    m.reply('An error occurred')
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']

handler.command = /^s(tic?ker)?(gif)?$/i
handler.register = true

export default handler

async function createSticker(img, url, packName, authorName, quality) {
  let stickerMetadata = {
    type: 'full',
    pack: stickpack,
    author: stickauth,
    quality
  }
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}