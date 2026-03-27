import type { PlaneInfo } from './types'
import { whitelist, blacklist } from './utils'


export const coords = { lat:process.env.COORD_LAT, lon:process.env.COORD_LON }
export const radius = 15 // nmi
export const secs = 30 * 1000
export const env = {
  pushover: { user: process.env.PUSHOVER_USER_KEY, token: process.env.PUSHOVER_API_KEY },
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    d1: {
      id: process.env.CLOUDFLARE_D1_ID,
      apiToken: process.env.CLOUDFLARE_D1_API_KEY
    }
  },
  owm: { coords, appid: process.env.OWM_API_KEY }
}


export function isBlacklisted({desc}:PlaneInfo):boolean {
  if (!desc) return false
  return blacklist.some(b => desc.toLowerCase().includes(b))
}

export function isWhitelisted({desc, r}:PlaneInfo):boolean {
  if (!desc && !r) return false
  const fields = [desc, r].filter(Boolean).map(f => f!.toLowerCase())
  return whitelist.some(w => fields.some(f => f.includes(w)) )
}