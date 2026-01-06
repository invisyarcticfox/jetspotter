import { Router } from 'express'
import { loadSeen } from '../../utils'
import fs from 'fs/promises'
import { seenFile } from '../../config'

export const routes = Router()


routes.get('/', async (_req,res) => {
  try {
    const data = await loadSeen()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error in GET /api/jetspotter:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

routes.get('/sort', async (req,res) => {
  try {
    const data = await loadSeen()

    const { by = 'date', count = 50 } = req.query as { by?:string, count?:number }
    let order: 'asc' | 'desc' = 'desc'
    if ('asc' in req.query) order = 'asc'
    else if ('desc' in req.query) order = 'desc'

    const sortedObject = Object.entries(data)
      .sort(([, a], [, b]) => {
        let valA: number
        let valB: number

        if (by === 'freq') {
          valA = a.seenCount
          valB = b.seenCount
        } else {
          valA = new Date(a.lastSeen).getTime()
          valB = new Date(b.lastSeen).getTime()
        }

        return order === 'asc' ? valA - valB : valB - valA
      })
      .slice(0, Number(count))
      .reduce<Record<string, typeof data[string]>>((acc, [hex, entry]) => { acc[hex] = entry; return acc }, {})

    res.status(200).json(sortedObject)
  } catch (error) {
    console.error('Error in GET /api/jetspotter/sort:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

routes.post('/photo', async (req,res) => {
  try {
    const input = req.body.trim().toUpperCase()
    const data = await loadSeen()

    let key = data[input] ? input : undefined
    if (!key) key = Object.keys(data).find(k => data[k].reg.toUpperCase() === input)
    if (!key) return res.status(404).json({ error: `No entry found for hex or registration: ${input}` })

    data[key].photographed = true
    await fs.writeFile(seenFile, JSON.stringify(data, null, 2), 'utf-8')

    res.status(200).json({ message: `Entry marked photographed`, entry: data[key] })
  } catch (error) {
    console.error('Error in GET /api/jetspotter/photo:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})