/*
```javascript 🐓
Author  : WATSON-XD
WA      : +263789622747
Base    : WATSON-MultiDevice
Release : 3 SEPTEMBER 2025
*/

let handler = m => m

handler.before = async function(m) {
    if (m.mentionedJid.length >= 20) await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
}

export default handler