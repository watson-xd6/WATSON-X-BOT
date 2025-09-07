let handler = async (m) => {
    const sentMsg = await conn.sendContactArray(m.chat, [
        [`${nomorown}`, `${await conn.getName(nomorown+'@s.whatsapp.net')}`, `💌 Developer Bot `, `Not Famous`, `fourpencewatson7@gmail.com`, `🇿🇼 Zimbabwe`, `📍 https://whatsapp.com/channel/0029Vb5m3D9A2pL6kvlwSf2S`, `👤 Owner WATSON-XD`],
        [`${conn.user.jid.split('@')[0]}`, `${await conn.getName(conn.user.jid)}`, `🎈 Whatsapp Bot`, `📵 Dont Spam`, `ryzumistarlette@gmail.com`, `🇿🇼 Zimbabwe`, `📍 https://github.com/watson-xd6/WATSON-XD-BOT`, `Just a regular bot that sometimes has errors ☺`]
    ], fkontak)
    await m.reply(`Hello @${m.sender.split(`@`)[0]} Thats my owner, dont spam or i will block u`)
}

handler.help = ['owner', 'creator']
handler.tags = ['main', 'info']
handler.command = /^(owner|creator)/i
export default handler