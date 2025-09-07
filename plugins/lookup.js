import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `This is the DNS Lookup result for Domain/Sub Domain!\n\n*Example:* ryzendesu.com`;

  if (text.includes('https://') || text.includes('http://')) throw `Please enter the full domain or subdomain. Example: ryzendesu.com`;

  try {
    // fetch pertama
    let api_key = 'E4/gdcfciJHSQdy4+9+Ryw==JHciNFemGqOVIbyv';
    let res1 = await fetch(`https://api.api-ninjas.com/v1/dnslookup?domain=${text}`, {
      headers: { 'X-Api-Key': api_key },
      contentType: 'application/json'
    })
    .then(response => response.text())
    .catch(error => {
      console.log(error);
      return fetch(`https://api.hackertarget.com/dnslookup/?q=${text}`)
      .then(response => response.text())
      .then(data => {
        m.reply(`*This is the DNS lookup result for ${text}:*\n${data}`)
        console.log(data)
      })
      .catch(error => {
        console.error(error)
        m.reply('*Unable to process the DNS Lookup request.*')
      })
    })
    m.reply(`*This is the DNS Lookup result for ${text}:*\n${res1}`)
    console.log(res1)

  } catch (error) {
    console.log(error);
    m.reply('*Invalid data!*')
  }
}

handler.help = ['lookup']
handler.tags = ['internet']
handler.command = /^(lookup)$/i

handler.register = true
handler.limit = true

export default handler
