import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import Pino from "pino"
import fs from "fs"

let sock
let status = "disconnected"

export async function startBot(pairNumber = null) {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  sock = makeWASocket({
    logger: Pino({ level: "silent" }),
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  if (pairNumber) {
    const code = await sock.requestPairingCode(pairNumber)
    console.log("PAIR CODE:", code)
    return code
  }

  sock.ev.on("connection.update", ({ connection }) => {
    status = connection
    if (connection === "open") {
      const cfg = JSON.parse(fs.readFileSync("./config.json"))
      sock.sendMessage(cfg.owner + "@s.whatsapp.net", {
        text: "✅ Bot Connected Successfully"
      })
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (!text.startsWith(".")) return

    const cmd = text.slice(1).split(" ")[0]
    const args = text.split(" ").slice(1)

    const enabled = JSON.parse(fs.readFileSync("./commands.json"))
    if (!enabled[cmd]) return

    const file = `./plugins/${cmd}.js`
    if (fs.existsSync(file)) {
      const plugin = await import(file)
      plugin.run(sock, msg, args)
    }
  })
}

export function getStatus() {
  return status
}
