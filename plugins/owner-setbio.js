let handler = async (m, { conn, text }) => {
  if (!text) throw `Enter text for the bot’s new bio`
    try {
   await conn.updateProfileStatus(text).catch(_ => _)
   conn.reply(m.chat, 'Successfully changed the bot’s bio.', m)
} catch {
      throw 'Yah Error.. :D'
    }
}
handler.help = ['setbio']
handler.tags = ['owner']
handler.command = /^(setbio)$/i
handler.owner = true

export default handler