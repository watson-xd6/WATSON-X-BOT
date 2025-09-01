import yts from 'yt-search'
import axios from 'axios'

const handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `Use example: ${usedPrefix}${command} Despacito`

  // 🔍 Search YouTube
  const search = await yts(text)
  const vid = search.videos[0]
  if (!vid) throw 'Video not found, coba judul lain ya Sayang~'

  const { title, thumbnail, url, timestamp, views, ago } = vid

  // 🖼️ Send result with buttons
  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: `🎶 *${title}*\n⌛ ${timestamp}\n👀 ${views} views\n📅 ${ago}\n\nPilih format yang ingin diunduh 👇`,
    footer: 'Powered by WATSON-XD',
    buttons: [
      {
        buttonId: `.ytmp3 ${url}`,
        buttonText: { displayText: '🎵 Download MP3' },
        type: 1
      },
      {
        buttonId: `.ytmp4 ${url}`,
        buttonText: { displayText: '📹 Download MP4' },
        type: 1
      }
    ],
    headerType: 4
  }, { quoted: m })
}

handler.help = ['play3 <query>']
handler.tags = ['downloader']
handler.command = /^play3$/i
handler.limit = 5

export default handler
