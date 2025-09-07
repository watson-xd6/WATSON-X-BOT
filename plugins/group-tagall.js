import { generateWAMessageFromContent } from '@adiwajshing/baileys'

let handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)

    if (text || m.quoted?.text) {
        m.reply(`Message content : _*${text ? `${text}*_\n` : ''}\n\n\n┌─「 Tag All 」\n` + users.map(v => '│◦❒ @' + v.replace(/@.+/, '')).join`\n` + '\n└────', null, {
            mentions: users
        })

        let usersDecode = participants.map(u => conn.decodeJid(u.id))
        let q = m.quoted ? m.quoted : m
        let c = m.quoted ? m.quoted : m.msg
        const msg = conn.cMod(m.chat,
            generateWAMessageFromContent(m.chat, {
                [c.toJSON ? q.mtype : 'extendedTextMessage']: c.toJSON ? c.toJSON() : {
                    text: c || ''
                }
            }, {
                quoted: m,
                userJid: conn.user.jid
            }),
            text || q.text, conn.user.jid, { mentions: usersDecode }
        )
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    } else {
        m.reply("Reply to the message or type the message you want to tag.")
    }
}
  
  handler.help = ['tagall']
  handler.tags = ['group']
  handler.command = ['tagall']
  handler.admin = true
  handler.group = true
  
  export default handler