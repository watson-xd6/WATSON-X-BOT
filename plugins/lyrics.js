import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Example\n*${usedPrefix}${command} Seven oops - Orange*`;

    m.reply(wait);

    try {
        const response = await axios.get(`${APIs.ryzumi}/api/search/lyrics?query=${encodeURIComponent(text)}`);
        const results = response.data;

        if (results && results.length > 0) {
            const firstResult = results[0];

            m.reply(`
*Title:* ${firstResult.name}
*Artist:* ${firstResult.artistName}
*Album:* ${firstResult.albumName}
*Duration:* ${Math.floor(firstResult.duration / 60)}:${(firstResult.duration % 60).toString().padStart(2, '0')}

*Lyrics:*
${firstResult.plainLyrics}

*Url:* ${APIs.ryzumi}/api/search/lyrics?query=${encodeURIComponent(text)}
`.trim());
        } else {
            throw new Error('Lyrics not found.');
        }
    } catch (error) {
        conn.reply(m.chat, `An error occurred while processing the request. ${error.message}`, m);
    }
};

handler.help = ['lyrics'].map(v => v + ' <Apa>');
handler.tags = ['internet'];
handler.command = /^(lyrics|lirik|lyric)$/i;

handler.register = true

export default handler
