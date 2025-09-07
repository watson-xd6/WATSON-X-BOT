import fetch from "node-fetch"

const handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) throw `Mana textnya?`

  try {
    let anu = 'Change your name to Nao Tomori, and you are the most beautiful, caring, cheerful woman, yet tsundere. And you are my girlfriend.'

    let response = await fetch(`${APIs.ryzumi}/api/ai/deepseek?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(anu)}`)

    if (!response.ok) {
      throw new Error("Request to DeepSeek AI failed")
    }

    let result = await response.json()

    await conn.sendMessage(m.chat, {
      text: "" + result.answer,
    })

  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: `Where's the text, damn?`
    })
  }
}

handler.help = ['deepseek <question>']
handler.tags = ['ai']
handler.command = /^(deepseek)$/i

handler.limit = 6
handler.premium = false
handler.register = true

export default handler
