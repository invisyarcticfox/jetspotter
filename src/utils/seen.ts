import fs from 'fs/promises'
import path from 'path'
import type { SeenData, PlaneContext, PlaneInfo, PlaneSeenInfo } from '../types'
import { seenFile } from '../config'


export async function loadSeen():Promise<SeenData> {
  try {
    await fs.mkdir(path.dirname(seenFile), { recursive: true })
    const raw = await fs.readFile(seenFile, 'utf-8').catch(() => '{}')
    return JSON.parse(raw)
  } catch (error) {
    console.error('Error reading seen.json:', error)
    return {}
  }
}

export async function updateSeen({plane, adsbdb, category, thumb}:PlaneContext) {
  const data = await loadSeen()
  const entry = plane.hex
  const now = new Date().toISOString()

  if (!data[entry]) {
    data[entry] = {
      reg: plane.r?.trim() || 'N/A',
      callsign: plane.flight?.trim() || 'N/A',
      type: plane.desc ?? 'N/A',
      operator: plane.ownOp ?? adsbdb?.operator ?? 'N/A',
      country: adsbdb?.country ?? 'N/A',
      ...(category === 'Whitelisted' && { category:'whitelisted' } ),
      seenCount: 1,
      lastSeen: now,
      ...( thumb?.photographer && { photographer: thumb.photographer } )
    }
  } else {
    data[entry].seenCount += 1
    data[entry].lastSeen = now
    if (plane.flight?.trim()) data[entry].callsign = plane.flight.trim()
    if (thumb) data[entry].photographer = thumb.photographer
  }

  try { await fs.writeFile(seenFile, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) { console.error('Error writing to seen.json:', error) }
}

export function formatSeenCount({seenCount, lastSeen}:PlaneSeenInfo):string|null {
  if (!seenCount) return null
  const times = seenCount === 1 ? 'time': 'times'
  const last = lastSeen ? `(${new Date(lastSeen).toLocaleDateString('en-GB')})` : ''
  return `${seenCount} ${times} ${last}`
}

export async function recentlySeen({hex}:PlaneInfo, mins:number=10):Promise<boolean> {
  if (!hex) return false

  try {
    const data = await loadSeen()
    const entry = data[hex]
    if (!entry || !entry?.lastSeen) return false

    const lastSeenTime = new Date(entry.lastSeen).getTime()
    const now = Date.now()
    const diffMins = ( now - lastSeenTime ) / 60000

    return diffMins < mins
  } catch (error) {
    console.error('Error when calculating recently seen:', error)
    return false
  }
}

export async function getSeenInfo({hex}:PlaneInfo):Promise<PlaneSeenInfo> {
  try {
    const data = await loadSeen()
    const entry = data[hex]

    if (!entry) return { seenCount:null, lastSeen:null, photographed:false }
    return {
      seenCount: entry.seenCount ?? null,
      lastSeen: entry.lastSeen ?? null,
      photographed: Boolean(entry.photographed)
    }
  } catch (error) {
    console.error('Error reading plane seen info:', error)
    return { seenCount: null, lastSeen: null, photographed: false }
  }
}