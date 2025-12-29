const { cmd } = require("../command");

cmd({
  pattern: "menu",
  alias: ["help", "commands"],
  desc: "Show all bot commands",
  category: "main",
  react: "📜",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const menuImage = "https://cdn.eypz.ct.ws/url/s4wx.jpg";
    const menuText = `
╭━━〔 *📖 CHALAH X BOT MENU* 〕━━⬣
┃
┃ 👑 *Owner:* @94721033354
┃ 🔧 *Version:* 3.0.0
┃ 🌐 *Status:* Online
┃
┣━〔 *📂 Plugin Commands* 〕━⬣
┃
┃*තාම හදන ගමන්* 💗❗
╰━━━━━━━━━━━━━━━━━━━━━━⬣

_𝐂𝐇𝐀𝐋𝐀𝐇 𝐗 𝐁𝐎𝐓 𝐕3_
`.trim();

    const contactQuote = {
      key: {
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "CHALAH-X",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:CHALAH-X\nTEL;type=CELL;type=VOICE;waid=94721033354:+94 721 033 354\nEND:VCARD`
        }
      }
    };

    await conn.sendMessage(from, {
      image: { url: menuImage },
      caption: menuText
    }, { quoted: contactQuote });

  } catch (e) {
    console.error(e);
    reply("❌ Error showing menu.");
  }
});
