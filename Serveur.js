const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/xtream/player_api.php', async (req, res) => {
  const { portal, username, password } = req.body
  if (!portal || !username || !password) {
    return res.status(400).json({ error: 'Paramètres manquants' })
  }
  try {
    const params = new URLSearchParams({ username, password })
    const url = portal.replace(/\/+$/, '') + '/player_api.php?' + params.toString()
    const r = await fetch(url, { timeout: 10000 })
    const text = await r.text()
    res.status(r.status).send(text)
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Proxy running on port ' + PORT))
