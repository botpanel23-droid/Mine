import express from "express"
import bodyParser from "body-parser"
import fs from "fs"
import { startBot, getStatus } from "./bot.js"

const app = express()
app.use(bodyParser.json())
app.use(express.static("public"))

app.get("/api/status", (req, res) => {
  res.json({ status: getStatus() })
})

app.post("/api/pair", async (req, res) => {
  const { number } = req.body
  const code = await startBot(number)
  res.json({ code })
})

app.get("/api/commands", (req, res) => {
  res.json(JSON.parse(fs.readFileSync("./commands.json")))
})

app.post("/api/commands/save", (req, res) => {
  fs.writeFileSync("./commands.json", JSON.stringify(req.body, null, 2))
  res.json({ saved: true })
})

app.post("/api/feature/status-like", (req, res) => {
  const cfg = JSON.parse(fs.readFileSync("./config.json"))
  cfg.autoStatusLike = req.body.value
  fs.writeFileSync("./config.json", JSON.stringify(cfg, null, 2))
  res.json({ ok: true })
})

app.listen(3000, () => {
  console.log("🚀 Bot Panel running on http://localhost:3000")
})
