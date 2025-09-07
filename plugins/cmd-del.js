let handler = async (m, { conn, usedPrefix, text, command }) => {
    let hash = text
    if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
    if (!hash) throw `No hash found.`
    let sticker = global.db.data.sticker
    if (sticker[hash] && sticker[hash].locked) throw 'You do not have permission to delete this sticker command.'
    delete sticker[hash]
    m.reply(`Successful!`)
}


handler.help = ['cmd'].map(v => 'del' + v + ' <teks>')
handler.tags = ['database', 'premium']
handler.command = ['delcmd']

handler.register = true
handler.premium = true

export default handler
