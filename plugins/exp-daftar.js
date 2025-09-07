import { createHash } from 'crypto'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { text, usedPrefix }) {
  let user = global.db.data.users[m.sender]
  if (user.registered === true) throw `You are already registered\ndo you want to register again? ${usedPrefix}unreg <SERIAL NUMBER>`
  if (!Reg.test(text)) throw `Format example\n*${usedPrefix}register name.age*`
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw 'Name cannot be empty (Alphanumeric)'
  if (!age) throw 'Age cannot be empty (Numbers).'
  age = parseInt(age)
  if (age > 120) throw 'Age is too old 😂'
  if (age < 16) throw 'ESM is not allowed to enter 😂'
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  
m.reply(`
Registration successful!

╭─「 Info 」
│ Name: ${name}
│ Age: ${age} years old
╰────
Serial Number: 
sn

*Terms of Service (TOS) - WATSON-XD BOT*
By using Watson-xd-bot, you agree to the following terms:

1. *STRICTLY FORBIDDEN TO MODIFY TIMERS/TEMPORARY MESSAGES*  
The bot will automatically ban your number. To request an unban, please contact the owner (+${global.nomorown}).

2. *NO NSFW MEDIA ALLOWED*  
The bot will automatically detect and ban your number. To request an unban, please contact the owner (+${global.nomorown}).

3. *NO SPAMMING THE BOT'S NUMBER*  
If spam is detected, the bot will issue a permanent ban.

4. *ONLY MESSAGE THE OWNER IF NECESSARY*  
There is no point in messaging the bot's number, as it is stored on the server and the owner will not see your message by using Watson-xd-bot, you agree to all applicable terms.

*These terms were last updated on September 1, 2025.*
Registering means you agree to the terms.
`.trim())
}

handler.help = ['register', 'daftar'].map(v => v + ' <name><age>')

handler.command = /^(daftar|reg(ister)?)$/i

export default handler
