let handler = async(m) => {
	
	if (!m.quoted) return m.reply(
		"Reply with the image/video you want to see."
	);
	let typ = ["image/jpeg", "video/mp4"]
	let regMedia = typ.includes(m.quoted.mimetype);
	let view = m.quoted?.viewOnce == true ? true : false
	
	if (regMedia && view) {
		let msg = await m.getQuotedObj()?.message;
		let type = Object.keys(msg)[0];
		let media = await m.quoted?.download() || await m.getQuotedObj()
		.download();
		if (!media) return m.reply("Failed to process media!")
	
		await conn.sendFile(
		m.chat, media, 'error.mp4', msg[type]?.caption || '', m
		);
	} else m.reply("This is not a view-once message.");
};

handler.help = ['vv']
handler.tags = ['tools']
handler.command = /^vv/i

handler.register = true

export default handler
