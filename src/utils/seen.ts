import type { PlaneInfo, PlaneSeenInfo, JetspotterData } from '~/types'
import { localDb } from '~/services'


export function formatSeenCount({seenCount, lastSeen}:PlaneSeenInfo):string|null {
  if (!seenCount) return null

  const times = seenCount === 1 ? 'time': 'times'
  let last = ''
  if (lastSeen) {
    const unix = Math.floor(new Date(lastSeen).getTime() / 1000)
    last = `(<t:${unix}:R>)`
  }
  return `${seenCount} ${times} ${last}`
}

export async function recentlySeen({hex}:PlaneInfo, mins:number=10):Promise<boolean> {
  if (!hex) return false

  try {
    const row = localDb.prepare(`SELECT lastSeen FROM jetspotter WHERE hex = ?`).get(hex) as JetspotterData
    if (!row.lastSeen) return false

    const lastSeenTime = new Date(row.lastSeen).getTime()
    const now = Date.now()
    const diffMins = ( now - lastSeenTime ) / 60_000

    return diffMins < mins
  } catch (error) {
    console.error('Error when calculating recently seen:', error)
    return false
  }
}

export async function getSeenInfo({hex}:PlaneInfo):Promise<PlaneSeenInfo> {
  if (!hex) return { seenCount: null, lastSeen: null, photographed: false }

  try {
    const row = localDb.prepare(`SELECT seenCount, lastSeen, photographed FROM jetspotter WHERE hex = ?`).get(hex) as JetspotterData
    if (!row) return { seenCount: null, lastSeen: null, photographed: false }

    return {
      seenCount: row.seenCount ?? null,
      lastSeen: row.lastSeen ?? null,
      photographed: row.photographed === 1
    }
  } catch (error) {
    console.error('Error reading plane seen info:', error)
    return { seenCount: null, lastSeen: null, photographed: false }
  }
}