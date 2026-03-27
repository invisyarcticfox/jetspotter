import Cloudflare from 'cloudflare'
import { env } from '~/config'
import type { PlaneContext } from '~/types'
import { logMsg } from '~/utils'

let client:Cloudflare|null = null

function getClient():Cloudflare {
  if (client) return client
  if (!env?.cloudflare?.d1?.apiToken) throw new Error('Cloudflare API token missing')

  client = new Cloudflare({ apiToken: env.cloudflare.d1.apiToken, timeout: 5000 })
  return client
}


export async function exec(sql:string, params:string[] = []) {
  const cfClient = getClient()
  for await (const result of cfClient.d1.database.query(env.cloudflare.d1.id, { account_id:env.cloudflare.accountId, sql, params })) {
    if (!result.success) console.error('D1 query failed:', result)
    return result.results ?? []
  }
  return []
}


export async function sendToD1({ plane, category, adsbdb, thumb }:PlaneContext) {
  const now = new Date().toISOString()

  const reg = plane.r?.trim() ?? 'N/A'
  const callsign = plane.flight?.trim() ?? 'N/A'
  const type = plane.desc ?? 'N/A'
  const operator = plane.ownOp ?? adsbdb?.operator ?? 'N/A'
  const country = adsbdb?.country ?? 'N/A'
  const cat = category === 'Whitelisted' ? 'whitelisted' : null
  const photographer = thumb?.photographer ?? null

  await exec(
    `
      INSERT INTO jetspotter
      (hex, reg, callsign, type, operator, country, category, seenCount, lastSeen, photographer)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)

      ON CONFLICT(hex) DO UPDATE SET
        seenCount = seenCount + 1,
        lastSeen = excluded.lastSeen,
        callsign = excluded.callsign,
        photographer = COALESCE(excluded.photographer, photographer)
    `, [ plane.hex, reg, callsign, type, operator, country, cat!, now, photographer! ]
  )

  logMsg(`Updated ${plane.hex} in Cloudflare D1`)
}

export async function authD1() {
  try {
    await exec('SELECT 1')
    console.log('Authenticated with Cloudflare D1')
  } catch (error) { console.error('Failed to authenticate with D1:', error) }
}

export async function markPhotographed(input:{upper:string, lower:string}) {
  await exec(`UPDATE jetspotter SET photographed = 1 WHERE LOWER(hex) = ? OR UPPER(reg) = ?`, [input.lower, input.upper] )
}