import axios from 'axios'
import { ryzenCDN } from '../lib/uploadFile.js'

const validFilters = ["coklat", "hitam", "nerd", "piggy", "carbon", "botak"];

let handler = async (m, { conn, args }) => {
    m.reply(wait);

    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw 'Send/Reply with an image and the caption .hitamkan.';

        let media = await q.download();
        if (!media) throw 'Failed to download media!';

        let cdnResult = await ryzenCDN(media);
        if (!cdnResult || !cdnResult.url) {
            throw 'Failed to upload to RyzenCDN!';
        }
        let url = cdnResult.url;

        let filter = (args[0] || 'coklat').trim().toLowerCase();
        if (!validFilters.includes(filter)) {
            return m.reply(`Filter yang tersedia: ${validFilters.join(', ')}`);
        }

        let response = await axios.get(`${APIs.ryzumi}/api/ai/negro`, {
            params: {
                url: url,
                filter: filter,
            },
            responseType: 'arraybuffer'
        });

        await conn.sendFile(m.chat, response.data, '', global.wm, m);
    } catch (error) {
        m.reply(error.message || 'Internal server error');
        console.error(error);
    }
};

handler.help = ['hitamkan']
handler.tags = ['ai']
handler.command = /^(hitamkan)$/i
handler.register = true
handler.limit = 2

export default handler
