let handler = async (m) => {

  let totalreg = Object.keys(global.db.data.users).length
  let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
  let kon = `*Current database. ${totalreg} user*\n*Current registration. ${rtotalreg} user*\n\nTo delete unregistered users, type *.delete-unreg*`
  m.reply(kon)
}

handler.help = ['user']
handler.tags = ['info']
handler.command = /^(user)$/i

handler.owner = true

export default handler
