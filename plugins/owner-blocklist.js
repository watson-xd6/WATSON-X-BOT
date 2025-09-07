let handler = async (m, { conn, usedPrefix }) => {
	await conn.fetchBlocklist().then(async data => {
		let txt = `*「  LIST OF BLOCKED NUMBERS  」*\n\n*Total:* ${data.length}\n\n┌─\n`
		for (let i of data) {
			txt += `├ @${i.split("@")[0]}\n`
		}
		txt += "└────"
		return conn.reply(m.chat, txt, m, { mentions: await conn.parseMention(txt) })
	}).catch(err => {
		console.log(err);
		throw 'Nothing is blocked!'
	})
}
handler.tags = ['info']
handler.help = ['blocklist']
handler.command = /^(blocklist)$/i

handler.owner = true

export default handler
