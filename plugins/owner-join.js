let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i;

let handler = async (m, { conn, text, isOwner }) => {
    let [_, code, expired] = text.match(linkRegex) || [];
    if (!code) throw 'Link invalid';
    let res;
    try {
        res = await conn.groupAcceptInvite(code);
    } catch (error) {
        if (error && error.message) {
            if (error.message.includes('not-authorized')) {
                return m.reply(`
Cannot join because you were previously kicked.  
Please wait up to 7 days, do not spam!!!

Note: Any reports about this will not be responded to by the Owner
                `);
            } else if (error.message.includes('gone')) {
                return m.reply('Link is invalid or has been reset by the admin.');
            }
        }
        throw error;
    }

    let user = global.db.data.users[m.sender];
    let now = Date.now();
    let maxTime = Math.floor((user.premiumTime - now) / (1000 * 60 * 60 * 24)); // calculate remaining premium time in days

    expired = Math.floor(Math.min(maxTime, Math.max(1, isOwner ? (isNumber(expired) ? parseInt(expired) : 0) : 3)));
    if (expired > maxTime) {
        return m.reply(`The group duration follows your premium duration the maximum days allowed are... ${maxTime}`);
    }

    m.reply(`Successfully joined the group ${res}${expired ? ` selama ${expired} day

If the group requires admin approval, please approve this number.` : ''}`);
    let chats = global.db.data.chats[res];
    if (!chats) chats = global.db.data.chats[res] = {};
    if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24;
};

handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];

handler.command = /^join$/i;
handler.rowner = false;
handler.premium = true;

export default handler;

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x));
