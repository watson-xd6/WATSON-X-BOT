import yts from 'yt-search'
import axios from 'axios'

/*  PLAY COMMAND (Search + Buttons) */
const playHandler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `Use example: ${usedPrefix}${command} Despacito`

  // 🔍 Search on YouTube
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

playHandler.help = ['play2 <query>']
playHandler.tags = ['downloader']
playHandler.command = /^play2$/i
playHandler.limit = 5


/*  YTMP3 COMMAND (Download MP3) */
const ytmp3Handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Kirim link YouTube yang ingin diunduh 🎶'

  try {
    const api = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(args[0])}`
    const res = await axios.get(api)
    const data = res.data

    if (!data || !data.url) throw 'Gagal mendapatkan link MP3 😢'

    await conn.sendMessage(m.chat, {
      audio: { url: data.url },
      mimetype: 'audio/mpeg',
      fileName: `${data.meta.title}.mp3`,
      caption: `🎶 *${data.meta.title}*\n⌛ ${data.meta.duration}`,
    }, { quoted: m })
  } catch (e) {
    throw `Gagal download MP3: ${e.message}`
  }
}

ytmp3Handler.help = ['ytmp3 <url>']
ytmp3Handler.tags = ['downloader']
ytmp3Handler.command = /^ytmp3$/i
ytmp3Handler.limit = 5


/*  YTMP4 COMMAND (Download MP4) */
const ytmp4Handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Kirim link YouTube yang ingin diunduh 📹'

  try {
    const api = `https://p.oceansaver.in/ajax/download.php?format=mp4&url=${encodeURIComponent(args[0])}`
    const res = await axios.get(api)
    const data = res.data

    if (!data || !data.url) throw 'Gagal mendapatkan link MP4 😢'

    await conn.sendMessage(m.chat, {
      video: { url: data.url },
      mimetype: 'video/mp4',
      fileName: `${data.meta.title}.mp4`,
      caption: `📹 *${data.meta.title}*\n⌛ ${data.meta.duration}`,
    }, { quoted: m })
  } catch (e) {
    throw `Gagal download MP4: ${e.message}`
  }
}

ytmp4Handler.help = ['ytmp4 <url>']
ytmp4Handler.tags = ['downloader']
ytmp4Handler.command = /^ytmp4$/i
ytmp4Handler.limit = 5


export default [
  playHandler,
  ytmp3Handler,
  ytmp4Handler
]
