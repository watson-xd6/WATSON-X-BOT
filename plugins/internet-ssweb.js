import axios from 'axios'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) return m.reply(`Gunakan format ${usedPrefix + command} <url>\n\n*Example :* ${usedPrefix + command} https://github.com/watson-xd`);
    
    m.reply(wait);

    if (!text.startsWith('https://') && !text.startsWith('http://')) {
        text = 'https://' + text;
    }

    const ssweb = async (url, mode) => {
        try {
            let response = await axios.get(`${APIs.ryzumi}/api/tool/ssweb`, {
                params: { url, mode },
                responseType: 'arraybuffer'
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    let screenshot;
    if (command === 'sshp') {
        screenshot = await ssweb(text, 'handphone');
    } else if (command === 'sspc') {
        screenshot = await ssweb(text, 'desktop');
    } else if (command === 'ssweb') {
        screenshot = await ssweb(text, 'desktop');
    }
    if (!screenshot) {
        return m.reply("Failed to capture screenshot. Make sure the URL is valid or try again later.");
    }

    let res = `Screenshot For ${text}`;

    await conn.sendMessage(m.chat, {
        image: screenshot,
        caption: res
    }, { quoted: m });
};

handler.help = ['ssweb', 'sspc', 'sshp'].map(v => v + ' <url>');
handler.tags = ['internet'];
handler.command = /^(ssweb|sspc|sshp)$/i;

handler.limit = 1
handler.register = true

export default handler
