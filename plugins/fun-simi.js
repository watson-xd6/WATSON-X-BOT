import fetch from 'node-fetch'

const handler = async (m, { text, args, usedPrefix, command }) => {
  try {
    if (!text) {
      throw `Use the example *${usedPrefix}simi hello*\nIf Simi doesn’t respond, try *${usedPrefix + command}2 hello Simi*`;
    }

    // Updated API endpoint and method
    const url = 'https://api.simsimi.vn/v1/simtalk';
    const lang = 'id'; // specify your desired language code
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `text=${encodeURIComponent(text)}&lc=${lang}&key=`,
    });

    if (!response.ok) {
      throw 'Failed to retrieve data';
    }

    const data = await response.json();
    const simiMessage = data.message || 'Failed to get response from Simi.';
    m.reply(simiMessage);
  } catch (error) {
    console.error('Error:', error);
    m.reply(text ? 'Failed to retrieve dataSend/Reply with an image and a caption.' : error);
  }
}

handler.command = ['simi']
handler.tags = ['fun']
handler.help = ['simi']

export default handler
