const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {
        // Tuma picha yenye caption ya alive
        await sock.sendMessage(chatId, {
            image: { url: 'https://files.catbox.moe/w0vmvc.jpg' }, 
            caption: `
═══════════════
𝐒𝐏𝐄𝐂𝐓𝐑𝐀-𝐕2 🤖: STATUS [ ONLINE ]*
Version: ${settings.version}

“Wake up to reality. 
Nothing ever goes as planned in this accursed world.” 🕶️

𝐒𝐏𝐄𝐂𝐓𝐑𝐀-𝐕2 Engine Is Alive Now 👨‍💻
═══════════════
Type *.menu* To see all commands 💣.
`
        }, { quoted: message });

        // Tuma audio kama PTT (voice note)
        await sock.sendMessage(chatId, {
            audio: { url: 'https://files.catbox.moe/9bj10g.mp3' },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '𝐒𝐏𝐄𝐂𝐓𝐑𝐀-𝐕2 iko hewani!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
