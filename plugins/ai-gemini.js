import fetch from "node-fetch"
import { ryzenCDN } from '../lib/uploadFile.js'

const handler = async (m, { text, usedPrefix, command, conn }) => {
  try {
    if (!text && !m.quoted && !m.mtype.includes('imageMessage')) {
      throw "Enter a question or send an image for a description!\n\n*Example:* Who is the president of Zimbabwe?";
    }

    let imgUrl = null;

    if (m.quoted && m.quoted.mtype === 'imageMessage') {
      let img = await m.quoted.download();
      if (img) {
        img = Buffer.from(img);
        let link = await ryzenCDN(img);
        if (!link) throw 'Failed to upload image';
        imgUrl = typeof link === 'object' ? link.url : link;
      }
    } else if (m.mtype.includes('imageMessage')) {
      let img = await m.download();
      if (img) {
        img = Buffer.from(img);
        let link = await ryzenCDN(img);
        if (!link) throw 'Failed to upload image';
        imgUrl = typeof link === 'object' ? link.url : link;
      }
    }

    let apiUrl;
    if (imgUrl) {
      apiUrl = `${APIs.ryzumi}/api/ai/gemini?text=${encodeURIComponent(text || '')}&url=${encodeURIComponent(imgUrl)}`;
    } else if (text) {
      apiUrl = `${APIs.ryzumi}/api/ai/gemini?text=${encodeURIComponent(text)}`;
    } else {
      throw "No valid text or image to process..";
    }

    let hasil = await fetch(apiUrl);
    if (!hasil.ok) throw new Error("API request failed.: " + hasil.statusText);

    let result = await hasil.json();
    if (!result.success) throw new Error("API response unsuccessful");

    let responseMessage = result.answer || "No response from AI";

    await conn.sendMessage(m.chat, { text: responseMessage });

  } catch (error) {
    console.error('Error in handler:', error);
    await conn.sendMessage(m.chat, { text: `Error: Where’s the text, dang?` });
  }
}

handler.help = ['gemini']
handler.tags = ['ai']
handler.command = /^(gemini)$/i

handler.limit = 8
handler.premium = false
handler.register = true

export default handler
