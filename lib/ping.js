module.exports = {
  name: "ping",
  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const start = Date.now();

    await sock.sendMessage(chatId, {
      image: { url: 'https://files.catbox.moe/h4vr2y.jpg' },
      caption: "🏓 Testing Ping..."
    }, { quoted: msg });

    const end = Date.now();
    const speed = end - start;

    await sock.sendMessage(chatId, {
      text: `⏱ Response time: ${speed}ms`
    }, { quoted: msg });

    await sock.sendMessage(chatId, {
      audio: { url: 'https://files.catbox.moe/1vkxii.mp3' },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: msg });
  }
}
