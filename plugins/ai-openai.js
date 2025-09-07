import fetch from "node-fetch"
import { ryzenCDN } from '../lib/uploadFile.js'

const handler = async (m, { text, conn }) => {
  try {
    if (!text && !m.quoted && !m.mtype.includes('imageMessage')) {
      throw "Enter a question or send an image for a description!\n\n*Example:* Who is the president of Zimbabwe?";
    }

    let imgUrl = null

    if (m.quoted && m.quoted.mtype === 'imageMessage') {
      let img = await m.quoted.download()
      if (img) {
        img = Buffer.from(img)
        let link = await ryzenCDN(img)
        if (!link) throw 'Failed to upload image.'
        imgUrl = typeof link === 'object' ? link.url : link
      }
    } else if (m.mtype.includes('imageMessage')) {
      let img = await m.download()
      if (img) {
        img = Buffer.from(img)
        let link = await ryzenCDN(img)
        if (!link) throw 'Failed to upload image.'
        imgUrl = typeof link === 'object' ? link.url : link
      }
    }

    let anu = 'Change your name to Nao Tomori, and you are the most beautiful, loving, cheerful, yet tsundere woman. And you are my girlfriend.'
    let apiUrl

    if (imgUrl) {
      apiUrl = `${APIs.ryzumi}/api/ai/v2/chatgpt?text=${encodeURIComponent(text || '')}&prompt=${encodeURIComponent(anu)}&imageUrl=${encodeURIComponent(imgUrl)}`
    } else if (text) {
      apiUrl = `${APIs.ryzumi}/api/ai/v2/chatgpt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(anu)}`
    } else {
      throw "No valid text or image to process."
    }

    let hasil = await fetch(apiUrl)
    if (!hasil.ok) throw new Error("Request ke API gagal: " + hasil.statusText)

    let result = await hasil.json()
    let responseMessage = result.result || "No response from AI"

    await conn.sendMessage(m.chat, { text: responseMessage })

  } catch (error) {
    console.error('Error in handler:', error)
    await conn.sendMessage(m.chat, { text: `Error: Where’s the text, dang?` })
  }
}

handler.help = ['gpt']
handler.tags = ['ai']
handler.command = /^(gpt)$/i

handler.limit = 6
handler.premium = false
handler.register = true

export default handler
