import path from 'path'
import type { PlaneInfo } from './types'


export const seenFile = path.join(process.cwd(), 'data', 'seen.json')
export const coords = { lat:process.env.COORD_LAT, lon:process.env.COORD_LON }
export const radius = 15 // nmi
export const secs = 30 * 1000
export const env = {
  pushover: {
    user: process.env.PUSHOVER_USER_KEY,
    token: process.env.PUSHOVER_API_KEY
  },
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY
  },
  discord: { auth: process.env.DISCORD_AUTH_KEY }
}


const blacklist = [ 'airbus helicopters' ]
export function isBlacklisted({desc}:PlaneInfo):boolean {
  if (!desc) return false
  return blacklist.some(d => desc.toLowerCase().includes(d))
}

const whitelist = [ 'beluga xl', 'antonov an-' ]
export function isWhitelisted({desc}:PlaneInfo):boolean {
  if (!desc) return false
  return whitelist.some(d => desc.toLowerCase().includes(d))
}