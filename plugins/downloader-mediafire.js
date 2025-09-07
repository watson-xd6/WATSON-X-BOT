import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example here: ${usedPrefix}${command} https://www.mediafire.com/file/in5j3u2zwoq1x33/BLUR_BLUR_ASIK.zip/file`;

    let mediafireApi = `${APIs.ryzumi}/api/downloader/mediafire?url=${encodeURIComponent(args[0])}`;
    m.reply(wait);

    try {
        let res = await axios.get(mediafireApi);
        let { status, data, error } = res.data;

        if (!status || !data || !data.downloadUrl) throw 'Failed to get the download link. Try again later.';

        let { filename, filesize, downloadUrl } = data;

        let caption = `
*📁 Name File:* ${filename}
*📦 File size:* ${filesize}
`.trim();

        let fileRes = await axios.get(downloadUrl, {
            responseType: 'arraybuffer'
        });

        m.reply(caption);
        await conn.sendFile(
            m.chat,
            Buffer.from(fileRes.data),
            filename,
            '',
            m,
            null,
            {
                asDocument: true
            }
        );
    } catch (e) {
        throw 'An error occurred.: ' + (e?.message || e);
    }
};

handler.help = ['mediafire'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(mediafire|mf)$/i;

handler.limit = true
handler.register = true

export default handler
