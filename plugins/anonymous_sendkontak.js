async function handler(m, { text }) {
    this.anonymous = this.anonymous ? this.anonymous : {}
    let sender = m.sender
    let room = Object.values(this.anonymous).find(room => room.check(sender))
    if (!room) throw 'You are not in an anonymous chat.'
    let other = room.other(sender)
    let tks = `➔ Number: ${sender.split`@`[0]}
➔ Name: ${this.getName(sender)}`
    this.reply(m.chat, 'Sending contact....')
    if (other) this.reply(other, `Your partner has sent you a contact.`)
    if (other) this.sendFile(other, await this.profilePictureUrl(m.sender, 'image').catch(_ => './src/avatar_contact.png'), '', `${htki} Anonymous Chat ${htka}\n` + tks)
}

handler.help = ['sendcontact']
handler.tags = 'anonymous'
handler.command = /^(sendcontact)$/i
handler.private = true

export default handler