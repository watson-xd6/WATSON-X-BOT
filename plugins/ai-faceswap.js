import axios from 'axios'
import { ryzenCDN } from '../lib/uploadFile.js'

let handler = async (m, { conn, args }) => {
    m.reply(wait)

    try {
        if (!args[0]) throw 'Enter the original image link.'

        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw 'Reply to the image with the caption .faceswap'

        let media = await q.download()
        if (!media) throw 'Failed to download media!'

        let cdnResult = await ryzenCDN(media)
        let url = cdnResult.url || cdnResult
        if (!url) throw 'Failed to upload to ryzenCDN!'

        let response = await axios.get(`${APIs.ryzumi}/api/ai/faceswap`, {
            params: {
                original: args[0],
                face: url
            },
            responseType: 'arraybuffer'
        })

        await conn.sendFile(m.chat, response.data, '', global.wm, m)
    } catch (error) {
        m.reply(error.message || 'Internal server error')
        console.error(error)
    }
}

handler.help = ['faceswap']
handler.tags = ['ai']
handler.command = /^(faceswap)$/i

handler.register = true
handler.limit = 5

export default handler
