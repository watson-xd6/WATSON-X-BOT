import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text || !text.trim()) throw 'Enter a valid username'
    let username = text.trim()

    m.reply(wait)

    try {
        const { data } = await axios.get(`${APIs.ryzumi}/api/stalk/instagram?username=${username}`)

        let caption = `
Name: ${data.name}
Username: ${data.username}
Bio: ${data.bio}
Followers: ${data.followers}
Following: ${data.following}
Posts: ${data.posts}
Avatar: ${data.avatar}
        `.trim()

        await conn.sendMessage(m.chat, { image: { url: data.avatar }, caption }, { quoted: m })
    } catch (err) {
        m.reply('Error: ' + err.message)
    }
}

handler.help = ['igstalk']
handler.tags = ['stalk']
handler.command = /^(igstalk|instagramstalk)$/i

handler.register = true
handler.limit = true

export default handler
