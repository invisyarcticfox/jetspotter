import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const dbDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir)
const dbPth = path.join(dbDir, 'jetspotter.db')

export const db = new Database(dbPth)

db.exec(`
  CREATE TABLE IF NOT EXISTS planes (
    hex TEXT NOT NULL PRIMARY KEY,
    reg TEXT,
    type TEXT,
    operator TEXT,
    country TEXT,
    seenCount INTEGER NOT NULL DEFAULT 1,
    lastSeen TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    category TEXT NOT NULL,
    photographed INTEGER NOT NULL DEFAULT 0 CHECK (photographed IN (0, 1)),
    photographer TEXT
  )
`)