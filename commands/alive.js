const quotes = [
  "Wake up to reality. Nothing ever goes as planned.",
  "Zenith-V4 never sleeps 😎",
  "Your favorite bot is Alive! 🚀",
  "Bots are the future 🤖",
  "Stay cool, stay Zenith 💠"
];

module.exports = {
  name: "alive",
  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    await sock.sendMessage(chatId, {
      image: { url: 'https://files.catbox.moe/h4vr2y.jpg' },
      caption: `✅ Zenith-V4 is Alive!\n\n"${randomQuote}"`
    }, { quoted: msg });

    await sock.sendMessage(chatId, {
      audio: { url: 'https://files.catbox.moe/1vkxii.mp3' },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: msg });
  }
}
