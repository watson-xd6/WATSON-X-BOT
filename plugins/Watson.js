import axios from 'axios'
import crypto from 'crypto'
import yts from 'yt-search'

const handler = async (m, { conn, args, command }) => {
  if (args.length < 1) return m.reply(`🔎 *Pencarian YouTube:*\n- *.play <judul>*\n\n📥 *Download Video/Audio:*\n- *.ytmp3 <url>*\n- *.ytmp4 <url> [quality]\n\n📌 *Quality:* 144, 240, 360, 480, 720, 1080 (default: 720p untuk video)`);

  let query = args.join(' ');
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  let username = conn.getName(who);

  let fkon = { 
    key: { 
      fromMe: false, 
      participant: `0@c.us`, 
      ...(m.chat ? { remoteJid: `status@broadcast` } : {}) 
    }, 
    message: { 
      contactMessage: { 
        displayName: username, 
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${username},;;;\nFN:${username}\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }
  };

  switch (command) {
    case 'play2':
      try {
        let searchResults = await yts(query);
        let video = searchResults.videos[0];

        if (!video) return m.reply("⚠️ *Tidak ada hasil untuk pencarian itu!*");

        let buttons = [
          { buttonId: `.ytmp3 ${video.url}`, buttonText: { displayText: ` Play MP3 ` }, type: 1 },
          { buttonId: `.ytmp4 ${video.url}`, buttonText: { displayText: ` Play MP4 ` }, type: 1 }
        ];

        let caption = `📌 *Hasil Pencarian:*\n\n📽 *Judul:* ${video.title}\n📅 *Upload:* ${video.ago}\n🛰️ *Durasi:* ${video.timestamp}\n🔭 *Views:* ${video.views.toLocaleString()}\n🎥 *Channel:* ${video.author.name}\n🔗 *Source:* ${video.url}`;

        await conn.sendMessage(m.chat, {
          text: caption,
          footer: 'Silahkan pilih formatnya:',
          buttons: buttons,
          headerType: 1
        }, { quoted: fkon });
      } catch (e) {
        return m.reply(`❌ *Gagal mencari video!*`);
      }
      break;

    case 'ytmp3':
    case 'ytmp4':
      let format = command === 'ytmp3' ? 'mp3' : args[1] || '720';
      if (!/^https?:\/\/(www\.)?youtube\.com|youtu\.be/.test(query)) return m.reply("⚠️ *Masukkan link YouTube yang valid!*");

      try {
        let res = await downloadYouTube(query, format);
        if (!res.status) return m.reply(`❌ *Error:* ${res.error}`);

        let { title, download, type } = res.result;

        if (type === 'video') {
          await conn.sendMessage(m.chat, { 
            video: { url: download },
            caption: `🎬 *${title}*`
          }, { quoted: fkon });
        } else {
          await conn.sendMessage(m.chat, { 
            audio: { url: download }, 
            mimetype: 'audio/mp4', 
            fileName: `${title}.mp3` 
          }, { quoted: fkon });
        }
      } catch (e) {
        m.reply(`*Gagal mengunduh!*`);
      }
      break;

    default:
      m.reply("*Command tidak dikenal!*");
  }
};

handler.menudownload = ['play', 'ytmp3', 'ytmp4'];
handler.command = ['play', 'ytmp3', 'ytmp4'];
export default handler;

// =========================================

async function downloadYouTube(link, format = '720') {
  const apiBase = "https://media.savetube.me/api";
  const apiCDN = "/random-cdn";
  const apiInfo = "/v2/info";
  const apiDownload = "/download";

  const decryptData = async (enc) => {
    try {
      const key = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return JSON.parse(decrypted.toString());
    } catch (error) {
      return null;
    }
  };

  const request = async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : apiBase}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://yt.savetube.me',
          'referer': 'https://yt.savetube.me/',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }
      });
      return { status: true, data: response };
    } catch (error) {
      return { status: false, error: error.message };
    }
  };

  const youtubeID = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (!youtubeID) return { status: false, error: "Gagal mengekstrak ID video dari URL." };

  try {
    const cdnRes = await request(apiCDN, {}, 'get');
    if (!cdnRes.status) return cdnRes;
    const cdn = cdnRes.data.cdn;

    const infoRes = await request(`https://${cdn}${apiInfo}`, { url: `https://www.youtube.com/watch?v=${youtubeID[1]}` });
    if (!infoRes.status) return infoRes;
    
    const decrypted = await decryptData(infoRes.data.data);
    if (!decrypted) return { status: false, error: "Gagal mendekripsi data video." };

    const downloadRes = await request(`https://${cdn}${apiDownload}`, {
      id: youtubeID[1],
      downloadType: format === 'mp3' ? 'audio' : 'video',
      quality: format,
      key: decrypted.key
    });

    return {
      status: true,
      result: {
        title: decrypted.title || "Tidak diketahui",
        type: format === 'mp3' ? 'audio' : 'video',
        format: format,
        download: downloadRes.data.data.downloadUrl
      }
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
}
