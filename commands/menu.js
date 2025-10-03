const quotes = [
  "Wake up to reality. Nothing ever goes as planned.",
  "Code. Deploy. Conquer. 🚀",
  "Another day, another line of JavaScript.",
  "Bots never sleep 🤖",
  "Zenith-V4 is always with you 💠"
];

module.exports = {
  name: "menu",
  aliases: ["help"],
  async execute(sock, msg, args, { commands, CONFIG }) {
    const chatId = msg.key.remoteJid;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    let menuText = `╔═══❖•ೋ° °ೋ•❖═══╗
   𝐙𝐄𝐍𝐈𝐓𝐇-𝐕𝟒  𝙼𝙴𝙽𝚄 📜
╚═══❖•ೋ° °ೋ•❖═══╝

Prefix: ${CONFIG.prefix}
Quote: "${randomQuote}"

Available Commands:\n`;

    const listed = [];
    for (let [key, cmd] of commands) {
      if (!listed.includes(cmd.name)) {
        menuText += `◈ ${CONFIG.prefix}${cmd.name}\n`;
        listed.push(cmd.name);
      }
    }

    await sock.sendMessage(chatId, {
      image: { url: 'https://files.catbox.moe/h4vr2y.jpg' },
      caption: menuText
    }, { quoted: msg });

    await sock.sendMessage(chatId, {
      audio: { url: 'https://files.catbox.moe/1vkxii.mp3' },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: msg });
  }
}
