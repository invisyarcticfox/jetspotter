import { Router } from 'express'
import { markPhotographed, localDb } from '~/services'

export const routes = Router()


routes.get('/', async (req, res) => {
  try {
    const page = Number(req.query.p ?? req.query.page ?? 1)
    const limit = 50
    if (page < 1) return res.status(400).json({ error: 'Invalid page number' })

    const offset = (page - 1) * limit
    const rows = localDb.prepare('SELECT * FROM jetspotter ORDER BY lastSeen DESC LIMIT ? OFFSET ?').all(limit, offset) as any[]
    if (rows.length === 0) return res.status(404).json({ error: 'No entries found' })

    const data:Record<string, any> = {}
    for (const row of rows) {
      const { hex, ...rest } = row
      Object.keys(rest).forEach(k => { if (rest[k] === null) delete rest[k] })
      data[hex] = rest
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error in GET /api/jetspotter:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

routes.get('/all', async (_req, res) => {
  try {
    const rows = localDb.prepare(`SELECT * FROM jetspotter`).all() as any[]
    const data:Record<string, any> = {}

    for (const row of rows) {
      const { hex, ...rest } = row
      Object.keys(rest).forEach(k => { if (rest[k] === null) delete rest[k] })
      data[hex] = rest
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error in GET /api/jetspotter/all:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

routes.post('/photo', async (req,res) => {
  try {
    const input = {
      lower: req.body.trim().toLowerCase(),
      upper: req.body.trim().toUpperCase()
    }

    localDb.prepare('UPDATE jetspotter SET photographed = 1 WHERE LOWER(hex) = ? OR UPPER(reg) = ?').run(input.lower, input.upper)
    await markPhotographed(input)

    res.status(204).end()
  } catch (error) {
    console.error('Error in GET /api/jetspotter/photo:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})