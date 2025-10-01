module.exports = {
  name: 'ping',
  aliases: ['p'],
  description: 'Check if ZENITH-V4 bot is responsive',
  ownerOnly: false,
  async execute(sock, msg, args, extra) {
    const chatId = msg.key.remoteJid;

    try {
      const start = Date.now();
      const sentMsg = await sock.sendMessage(chatId, { text: 'Pinging... ⏳' }, { quoted: msg });
      const latency = Date.now() - start;

      await sock.sendMessage(chatId, { text: `Pong! 🏓\nResponse Time: ${latency}ms` }, { quoted: sentMsg });
    } catch (error) {
      console.error('Error in ping command:', error);
      await sock.sendMessage(chatId, { text: 'Error: Could not ping ZENITH-V4!' }, { quoted: msg });
    }
  }
};
