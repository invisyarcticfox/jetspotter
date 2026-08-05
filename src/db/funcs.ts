import type { CTX, DB } from '~/types'
import { db } from '.'


export function updateDb({plane, thumb, category}:CTX) {
  db.prepare(`
    INSERT INTO planes
    (hex, reg, type, operator, country, category, photographer)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(hex) DO UPDATE SET
      seenCount = seenCount + 1,
      lastSeen = (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      photographer = COALESCE(excluded.photographer, photographer)
  `).run(
    plane.hex,
    plane.reg ?? null,
    plane.type ?? null,
    plane.operator ?? null,
    plane.country ?? null,
    category.toLowerCase(),
    thumb?.photographer ?? null
  )

  console.log('Updated database.')
}

export function getDb(hex:string):Omit<DB, 'photographed'> & { photographed:boolean }|null {
  const query = db.prepare(`SELECT * from PLANES where HEX = ?`).get(hex) as DB|undefined
  if (!query) return null

  return {
    ...query,
    photographed: query.photographed === 1
  }
}