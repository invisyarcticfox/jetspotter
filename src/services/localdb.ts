import Database from 'better-sqlite3'
import path from 'path'
import { PlaneContext } from '~/types'

const dbPath = path.join(process.cwd(), 'data', 'seen.db')
export const localDb = new Database(dbPath)


localDb.exec(`
  CREATE TABLE IF NOT EXISTS jetspotter (
    hex TEXT PRIMARY KEY NOT NULL,
    reg TEXT,
    callsign TEXT,
    type TEXT,
    operator TEXT,
    country TEXT,
    category TEXT,
    seenCount INTEGER DEFAULT 0,
    lastSeen TEXT,
    photographed INTEGER,
    photographer TEXT
  )
`)


export function updateLocalDb({plane, adsbdb, category, thumb}:PlaneContext) {
  const now = new Date().toISOString()

  const stmt = localDb.prepare(`
    INSERT INTO jetspotter
    (hex, reg, callsign, type, operator, country, category, seenCount, lastSeen, photographer)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    ON CONFLICT(hex) DO UPDATE SET
      seenCount = seenCount + 1,
      lastSeen = excluded.lastSeen,
      callsign = excluded.callsign,
      photographer = COALESCE(excluded.photographer, photographer)
  `)

  stmt.run(
    plane.hex,
    plane.r?.trim() ?? 'N/A',
    plane.flight?.trim() ?? 'N/A',
    plane.desc ?? 'N/A',
    plane.ownOp ?? adsbdb?.operator ?? 'N/A',
    adsbdb?.country ?? 'N/A',
    category === 'Whitelisted' ? 'whitelisted' : null,
    now,
    thumb?.photographer ?? null
  )
}