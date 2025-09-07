let handler = async (m, { conn }) => {
    if (!m.quoted) throw 'Please reply with the channel’s name.'
    try {
        let id = (await m.getQuotedObj()).msg.contextInfo.forwardedNewsletterMessageInfo
        await m.reply(`Name: ${id.newsletterName}\nId: ${id.newsletterJid}`)
    } catch (e) {
        throw 'You have to chat from the channel, bro.'
    }
}

handler.help = handler.command = ['ci']
handler.tags = ['tools']

handler.register = true

export default handler