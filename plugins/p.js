import { cpus as _cpus, totalmem, freemem } from 'os'
import os from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2 })

const handler = async (m, { conn }) => {
  let old = performance.now()
  await m.reply('Testing speed...')
  let speed = performance.now() - old

  const used = process.memoryUsage()
  const cpus = _cpus()
  const cpu = cpus[0]

  let text = `*⚡ Ping:* ${Math.round(speed)} ms
*💻 RAM:* ${format(totalmem() - freemem())} / ${format(totalmem())}
*🖥️ CPU:* ${cpu ? cpu.model.trim() : 'N/A'} (${cpu ? cpu.speed : 0} MHz)
*📦 NodeJS:* ${Object.keys(used).map(v => `${v}: ${format(used[v])}`).join(', ')}
*🌍 OS:* ${os.platform()} (${os.hostname()})
`

  await conn.sendMessage(m.chat, {
    text,
    footer: "WATSON-XD SPEED TEST",
    buttons: [
      { buttonId: 'ping2', buttonText: { displayText: "🔁 Re-Test" }, type: 1 },
      { buttonId: 'menu', buttonText: { displayText: "📂 Main Menu" }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['ping2', 'speed2']
handler.tags = ['info']
handler.command = /^(ping2|speed2)$/i

export default handler
