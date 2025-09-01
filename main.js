// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import './config.js'

import path, { join } from 'path'
import pino from 'pino'
import ws from 'ws'
import syntaxerror from 'syntax-error'
import chalk from 'chalk'
import { platform } from 'process'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module' // Bring in the ability to create the 'require' method
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} from 'fs'
import { spawn } from 'child_process'
import { tmpdir } from 'os'
import { format } from 'util'
const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = await import('@adiwajshing/baileys')
import { Low, JSONFile } from 'lowdb'
import { makeWASocket, protoType, serialize } from './lib/simple.js'

const { CONNECTING } = ws

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(global.conn, ...args) }

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
const __dirname = global.__dirname(import.meta.url)

global.prefix = new RegExp('^[' + '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-'.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
global.db = new Low(new JSONFile('database.json'));

global.loadDatabase = async function loadDatabase() {
  if(db.READ) return new Promise((resolve) => setInterval(async function () {
    if(!db.READ) {
      clearInterval(this)
      resolve(db.data == null ? global.loadDatabase() : db.data)
    }
  }, 1 * 1000))
  if(db.data !== null) return
  db.READ = true
  await db.read().catch(console.error)
  db.READ = null
  db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(db.data || {})
  }
}
loadDatabase()

const { version } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState('./sessions')
const connectionOptions = {
  version,
  logger: pino({ level: 'silent' }),
  //printQRInTerminal: false,
  // Optional If Linked Device Could'nt Connected
  // browser: ['Mac OS', 'chrome', '125.0.6422.53']
  browser: ['Mac OS', 'safari', '5.1.10'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino().child({
      level: 'silent',
      stream: 'store'
    })),
  },
  generateHighQualityLinkPreview: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!(
      message.buttonsMessage
      || message.templateMessage
      || message.listMessage
    );
    if(requiresPatch) {
      message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {},
            },
            ...message,
          },
        },
      };
    }

    return message;
  },
  connectTimeoutMs: 60000, defaultQueryTimeoutMs: 0, generateHighQualityLinkPreview: true, syncFullHistory: true, markOnlineOnConnect: true
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false

if(global.db) {
   setInterval(async () => {
    if(global.db.data) await global.db.write().catch(console.error);
    if(global.support?.find) {
      const tmp = [tmpdir(), 'tmp'];
      tmp.forEach(filename => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']));
    }
  }, 60000);
}

if(existsSync('./sessions/creds.json') && !conn.authState.creds.registered) {
  console.log(chalk.yellow('-- WARNING: creds.json is broken, please delete it first --'));
  process.exit(0);
}

if(!conn.authState.creds.registered) {
  console.log(chalk.bgWhite(chalk.blue('Generating code...')))
  setTimeout(async () => {
    let code = await conn.requestPairingCode(global.pairing)
    code = code?.match(/.{1,4}/g)?.join('-') || code
    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
  }, 3000)
}

async function connectionUpdate(update) {
  const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;

  if(isNewLogin) {
    conn.isInit = true;
  }

  if(connection == 'connecting') {
    console.log(chalk.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'));
  } else if(connection == 'open') {
    console.log(chalk.green('✅ Tersambung'));
  }

  if(isOnline == true) {
    console.log(chalk.green('Status Aktif'));
  } else if(isOnline == false) {
    console.log(chalk.red('Status Mati'));
  }

  if(receivedPendingNotifications) {
    console.log(chalk.yellow('Menunggu Pesan Baru'));
  }

  if(connection == 'close') {
    console.log(chalk.red('⏱️ Connection lost & trying to reconnect....'));
  }

  if(lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== CONNECTING) {
    console.log(await global.reloadHandler(true));
  }

  if(global.db.data == null) {
    await global.loadDatabase();
  }
}

process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  /*try {
      const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)*/
  try {
    // Jika anda menggunakan replit, gunakan yang sevenHoursLater dan tambahkan // pada const Handler
    // Default: server/vps/panel, replit + 7 jam buat jam indonesia Jika Tidak Faham Pakai Milidetik 3600000 = 1 Jam Dan Kalikan 7 = 25200000
    // const sevenHoursLater = Dateindonesia 7 * 60 * 60 * 1000;
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    // const Handler = await import(`./handler.js?update=${sevenHoursLater}`).catch(console.error)
    if(Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if(restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if(!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  
conn.welcome = '❖━━━━━━[ Welcome ]━━━━━━❖\n\n┏––––––━━━━━━━━•\n│☘︎ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hello @user)\n├[ Intro ]—\n│ NAME: \n│ AGE: \n│ GENDER:\n┗––––––━━┅┅┅\n\n––––––┅┅ DESCRIPTION ┅┅––––––\n@desc'
  
conn.bye = '❖━━━━━━[ Leaving ]━━━━━━❖\nGoodbye @user 👋😃'
conn.spromote = '@user is now an admin!'
conn.sdemote = '@user is no longer an admin!'
conn.sDesc = 'Group description has been changed to \n@desc'
conn.sSubject = 'Group name has been changed to \n@subject'
conn.sIcon = 'Group icon has been updated!'
conn.sRevoke = 'Group link has been changed to \n@revoke'
conn.sAnnounceOn = 'Group has been closed!\nNow only admins can send messages.'
conn.sAnnounceOff = 'Group has been opened!\nNow all participants can send messages.'
conn.sRestrictOn = 'Group info editing set to admin only!'
conn.sRestrictOff = 'Group info editing set to all participants!'

  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.onDelete = handler.deleteUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn)

  conn.ev.on('call', async (call) => {
    console.log('Panggilan diterima:', call);
    if(call.status === 'ringing') {
      await conn.rejectCall(call.id);
      console.log('Panggilan ditolak');
    }
  })
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true

}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e, filename)
      delete global.plugins[filename]
    }
  }
}
filesInit().then(_ => console.log(chalk.green('✅ Successfully loaded plugins'))).catch(console.error)

global.reload = async (_ev, filename) => {
  if(pluginFilter(filename)) {
    let dir = global.__filename(join(pluginFolder, filename), true)
    if(filename in global.plugins) {
      if(existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`)
    let err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
    if(err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
    else try {
      const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

// Quick Test

async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127);
        });
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false));
      })
    ]);
  }));

  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  console.log(test);

  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  };

  Object.freeze(global.support);

  if(!s.ffmpeg) {
    conn.logger.warn(`Please install *ffmpeg* first so you can send videos.`);
  }

  if(s.ffmpeg && !s.ffmpegWebp) {
    conn.logger.warn('Sticker may not animate because *libwebp* is not enabled in *ffmpeg* (`--enable-libwebp` while compiling)');
  }

  if(!s.convert && !s.magick && !s.gm) {
    conn.logger.warn('Sticker feature may not work because *ImageMagick* and *libwebp* in *ffmpeg* are not installed (pkg install imagemagick)');
  }
}

_quickTest().then(() => conn.logger.info('☑️ Quick Test Done , nama file session ~> creds.json')).catch(console.error);
