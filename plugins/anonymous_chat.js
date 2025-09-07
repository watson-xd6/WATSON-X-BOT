async function handler(m, { command, usedPrefix }) {
    command = command.toLowerCase()
    this.anonymous = this.anonymous ? this.anonymous : {}
    switch (command) {
        case 'next':
        case 'leave': {
            let room = Object.values(this.anonymous).find(room => room.check(m.sender))
            if (!room) return this.reply(m.chat, `*You are not currently in an anonymous chat.*\n*To start finding a partner, type:* ${usedPrefix}start`, m)
            m.reply('Ok')
            let other = room.other(m.sender)
            if (other) await this.reply(other, `*Partner has left the chat.*\nto find a partner, type: ${usedPrefix}start`, m)
            delete this.anonymous[room.id]
            if (command === 'leave') break
        }
        case 'start': {
            if (Object.values(this.anonymous).find(room => room.check(m.sender))) return this.reply(m.chat, `*You are still in an anonymous chat, waiting for a partner\nto stop searching for a partner, type:* ${usedPrefix}leave`, m)
            let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
            if (room) {
                await this.reply(room.a, `_Partner ditemukan!_\nTo search for a partner again, type: ${usedPrefix}next`, m)
                room.b = m.sender
                room.state = 'CHATTING'
                await this.reply(room.a, `_Partner ditemukan!_\nTo search for a partner again, type: ${usedPrefix}next`, m)
            } else {
                let id = + new Date
                this.anonymous[id] = {
                    id,
                    a: m.sender,
                    b: '',
                    state: 'WAITING',
                    check: function (who = '') {
                        return [this.a, this.b].includes(who)
                    },
                    other: function (who = '') {
                        return who === this.a ? this.b : who === this.b ? this.a : ''
                    },
                }
                await this.reply(m.chat, `_Waiting for a partner.._\nto stop, type: ${usedPrefix}leave`, m)
            }
            break
        }
    }
}

handler.help = ['start', 'leave', 'next']
handler.tags = ['anonymous']
handler.command = ['start', 'leave', 'next']

handler.private = true

export default handler