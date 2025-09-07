let handler = async (m, {
	conn,
	usedPrefix
}) => {
	let warning = global.db.data.users[m.sender].warning

	let ndy = `
*You have ${warning} Warn*
 `.trim()
	conn.reply(m.chat, ndy, m)
}

handler.help = ['checkwarn']
handler.tags = ['info']
handler.command = /^(checkwarn)$/i

handler.register = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
