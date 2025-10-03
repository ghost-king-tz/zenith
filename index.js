const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  jidNormalizedUser,
  useMultiFileAuthState,
  useSingleFileAuthState
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const logger = pino({ level: 'info' });

// ====== CONFIG ======
const CONFIG = {
  prefix: '.',   // prefix ya commands zako
  owner: ['255719632816@s.whatsapp.net'], // namba yako ya WhatsApp
  commandsDir: path.join(__dirname, 'commands'),  // sasa inasoma lib/
  reconnectInterval: 5000
};
// =====================

const commands = new Map();

// Load commands zote
function loadCommands() {
  commands.clear();
  if (!fs.existsSync(CONFIG.commandsDir)) fs.mkdirSync(CONFIG.commandsDir, { recursive: true });
  const files = fs.readdirSync(CONFIG.commandsDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const full = path.join(CONFIG.commandsDir, file);
      delete require.cache[require.resolve(full)];
      const cmd = require(full);
      if (!cmd || !cmd.name || typeof cmd.execute !== 'function') {
        logger.warn(`Skipping invalid command file: ${file}`);
        continue;
      }
      cmd.aliases = cmd.aliases || [];
      commands.set(cmd.name, cmd);
      for (const a of cmd.aliases) commands.set(a, cmd);
      logger.info(`Loaded command: ${cmd.name}`);
    } catch (e) {
      logger.error(`Error loading ${file}: ${e.message}`);
    }
  }
}

// Main function
async function startSock() {
  let auth;
  
  if (process.env.SESSION_ID) {
    // 🔑 Heroku mode: tumia SESSION_ID env var
    const { state, saveState } = useSingleFileAuthState('./session.json');
    fs.writeFileSync('./session.json', Buffer.from(process.env.SESSION_ID, 'base64').toString('utf-8'));
    auth = state;
  } else {
    // Local mode: tumia multi-file auth
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    auth = state;
    sock.ev.on('creds.update', saveCreds);
  }

  const { version } = await fetchLatestBaileysVersion();
  logger.info('Using Baileys v' + version.join('.'));

  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth,
    version
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        logger.error('Logged out, delete session and scan QR again.');
        process.exit(0);
      } else {
        logger.warn('Reconnecting...');
        setTimeout(startSock, CONFIG.reconnectInterval);
      }
    } else if (connection === 'open') {
      logger.info('✅ Connected to WhatsApp!');
    }
  });

  // Handle messages
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return;

    const from = msg.key.remoteJid;
    const sender = jidNormalizedUser(msg.key.participant || msg.key.remoteJid);

    let body = '';
    if (msg.message.conversation) body = msg.message.conversation;
    else if (msg.message.extendedTextMessage) body = msg.message.extendedTextMessage.text;
    else if (msg.message.imageMessage?.caption) body = msg.message.imageMessage.caption;
    else if (msg.message.videoMessage?.caption) body = msg.message.videoMessage.caption;

    body = body.trim();
    if (!body.startsWith(CONFIG.prefix)) return;

    const args = body.slice(CONFIG.prefix.length).trim().split(/\s+/);
    const cmdName = args.shift().toLowerCase();

    const cmd = commands.get(cmdName);
    if (!cmd) return;

    // Owner only?
    if (cmd.ownerOnly && !CONFIG.owner.includes(sender)) {
      await sock.sendMessage(from, { text: '🚫 Owner only command!' }, { quoted: msg });
      return;
    }

    try {
      await cmd.execute(sock, msg, args, { commands, CONFIG });
    } catch (err) {
      logger.error('Command error: ' + err.message);
      await sock.sendMessage(from, { text: '⚠️ Error: ' + err.message }, { quoted: msg });
    }
  });
}

// Start bot
loadCommands();
startSock();
