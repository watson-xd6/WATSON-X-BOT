export async function before(m) {
	if (!m.chat.endsWith('@s.whatsapp.net')) return !0;
	this.menfess = this.menfess ? this.menfess : {}
	let mf = Object.values(this.menfess).find(v => v.status === false && v.penerima == m.sender)
	if (!mf) return !0
	console.log(m)
	if (m.text === 'Balas' && m.quoted.mtype == 'buttonsMessage') return m.reply("Please send your reply message.");
	let txt = `Hello dear @${mf.dari.split('@')[0]}, You received a reply here.\n\nReply message:\n${m.text}\n`.trim();
	await this.reply(mf.dari, txt, null).then(() => {
		m.reply('Memfess reply sent.')
		this.delay(1000)
		delete this.menfess[mf.id]
		return !0
	})
}
