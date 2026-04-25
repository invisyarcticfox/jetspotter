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


export function isBlacklisted({ desc, r }:PlaneInfo):boolean {
  const d = desc?.toLowerCase() || ''
  const reg = r?.toLowerCase() || ''
  return ( blacklist.desc.some(b => d.includes(b)) || blacklist.reg.some(b => reg.includes(b)) )
}

export function isWhitelisted({ desc, r }:PlaneInfo):boolean {
  const d = desc?.toLowerCase() || ''
  const reg = r?.toLowerCase() || ''
  return ( whitelist.desc.some(w => d.includes(w)) || whitelist.reg.some(w => reg.includes(w)) )
}