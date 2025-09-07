// Script by ShirokamiRyzen
// Dont delete this credit!!!

import fetch from 'node-fetch'

let handler = m => m;

handler.before = async (m) => {
    let chat = global.db.data.chats[m.chat];
    if (chat.autogpt && !chat.isBanned) {
        if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text) return;

        try {
            let prompt = encodeURIComponent("Change your name to kimm, and you are the most beautiful, caring, cheerful woman, but also tsundere. And you are my girlfriend.");
            let res = await fetch(`${APIs.ryzumi}/api/ai/v2/chatgpt?text=${encodeURIComponent(m.text)}&prompt=${prompt}`, {
                method: 'GET'
            });

            if (!res.ok) throw new Error("Failed to fetch data from API");

            let json = await res.json();
            if (json.action !== 'success') return m.reply('Gagal mendapatkan respons dari API');

            let replyMessage = json.response || 'Failed to get a response from the API.';
            await m.reply(replyMessage);
        } catch (error) {
            m.reply('An error occurred while processing the request.');
        }

        return true
    }
    return true
};

export default handler
