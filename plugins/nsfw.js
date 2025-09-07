import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
  // Check if it's a group chat
  if (m.isGroup && !global.db.data.chats[m.chat].nsfw) {
    throw `🚫 NSFW is not enabled in this group. \n\n type \n*${usedPrefix}enable* Type *nsfw* to enable this feature.`;
  }

  // Check user age
  let user = global.db.data.users[m.sender].age;
  if (user < 17) throw m.reply(`*It seems like you’re under 18 years old!*`);

  if (!args[0]) throw `select tag:\nblowjob\nneko\ntrap\nwaifu`;

  let res = await fetch(`https://api.waifu.pics/nsfw/${text}`);
  if (!res.ok) throw await res.text();

  let json = await res.json();
  if (!json.url) throw 'Error!';

  conn.sendFile(m.chat, json.url, '', global.wm, m);
};

handler.command = /^(nsfw)$/i

handler.register = true
handler.premium = true
handler.limit = false

export default handler
