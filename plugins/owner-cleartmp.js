import { tmpdir } from 'os'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'

let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {

  const tmp = [tmpdir(), join(__dirname, '../tmp')];
  const filenames = [];

  tmp.forEach(dirname => {
    readdirSync(dirname).forEach(file => {
      filenames.push(join(dirname, file));
    });
  });

  const deletedFiles = [];

  filenames.forEach(file => {
    const stats = statSync(file);

    if (stats.isDirectory()) {
      // console.log(`Skipping directory: ${file}`);
    } else {
      unlinkSync(file);
      deletedFiles.push(file);
    }
  });

  conn.reply(m.chat, 'Success!', m);

  if (deletedFiles.length > 0) {
    // console.log('Deleted files:', deletedFiles);
    // conn.reply(m.chat, `Deleted files:\n${deletedFiles.join('\n')}`, m);
    conn.reply(m.chat, `Files deleted`, m)
  }

  if (deletedFiles.length == 0) {
    conn.reply(m.chat, 'No files left in tmp.', m);
  }
}

handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = /^(cleartmp|clear|tmpclear|cleantmp)$/i
handler.rowner = true

export default handler