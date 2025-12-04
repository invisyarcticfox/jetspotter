import type { FlightInfo } from './types'


export const coord = { lat: process.env.COORD_LAT, lon: process.env.COORD_LON }
export const radius = 15
export const secs = 30 * 1000
export const poUserKey = process.env.PUSHOVER_USER_KEY
export const poApiKey = process.env.PUSHOVER_API_KEY
// export const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
// export const cfAccessKey = process.env.CLOUDFLARE_ACCESS_KEY_ID

const blacklist = [ 'AIRBUS HELICOPTERS' ]
export function isBlacklisted(flight:FlightInfo):boolean {
  if (!flight.desc) return false
  return blacklist.some(phrase => flight.desc!.includes(phrase))
}

const whitelist = [ 'Beluga XL', 'ANTONOV An-' ]
export function isWhitelisted(flight:FlightInfo):boolean {
  if (!flight.desc) return false
  return whitelist.some(phrase => flight.desc!.includes(phrase))
}
