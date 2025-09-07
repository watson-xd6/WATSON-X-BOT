let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `If you find an error message, report it using this command\n\nexample:\n${usedPrefix + command} Good afternoon owner, I found an error like this: <copy/tag the error message>`
    if (text.length < 10) throw `Report is too short, minimum 10 characters required!`
    if (text.length > 1000) throw `Report too long, maximum 1000 characters!`
    let teks = `*${command.toUpperCase()}!*\n\nFrom : *@${m.sender.split`@`[0]}*\n\nMessage : ${text}\n`
    conn.reply(global.nomorown + '@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {
        contextInfo: {
            mentionedJid: [m.sender]
        }
    })
    m.reply(`Message sent to the bot owner, if... ${command.toLowerCase()} Just joking won’t be taken seriously._`)
}
handler.help = ['report', 'request'].map(v => v + ' <text>')
handler.tags = ['info']
handler.command = /^(report|request)$/i

handler.register = true
handler.disable = false

export default handler