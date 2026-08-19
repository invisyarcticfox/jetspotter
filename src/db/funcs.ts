import type { CTX, DB } from '~/types'
import { db } from '.'


export function getDb(hex:string):Omit<DB, 'photographed'> & { photographed:boolean }|null {
  const query = db.prepare(`SELECT * from PLANES WHERE hex = ?`).get(hex) as DB|undefined
  if (!query) return null

  return {
    ...query,
    photographed: query.photographed === 1
  }
}

export function updateDb({plane, thumb, category}:CTX) {
  db.prepare(`
    INSERT INTO planes
    (hex, reg, type, operator, country, category, photographer)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(hex) DO UPDATE SET
      seenCount = CASE
        WHEN date(lastSeen) != date('now') THEN seenCount + 1
        ELSE seenCount
      END,
      lastSeen = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      photographer = COALESCE(excluded.photographer, photographer),
      operator = COALESCE(excluded.operator, operator)
  `).run(
    plane.hex,
    plane.reg ?? null,
    plane.type ?? null,
    plane.operator ?? null,
    plane.country ?? null,
    category.toLowerCase(),
    thumb?.photographer ?? null
  )

  console.log('Updated database')
}

export function seenRecently(hex:string, mins:number=10) {
  const query = db.prepare(`SELECT lastSeen FROM planes WHERE hex = ?`).get(hex) as {lastSeen:string}|undefined
  if (!query) return false

  const lastSeen = new Date(query.lastSeen).getTime()
  const cutoff = Date.now() - mins * 60 * 1000
  return lastSeen > cutoff
}