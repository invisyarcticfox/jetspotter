import type { FlightInfo } from './types'

export const baseUrl = 'https://api.adsb.one/v2/point'
export const coord = { lat: process.env.COORD_LAT, lon: process.env.COORD_LON }
export const radius = 20
export const secs = 20 * 1000
export const whUrl = process.env.DISCORD_WEBHOOK_URL as string
export const poUserKey = process.env.PUSHOVER_USER_KEY as string
export const poApiKey = process.env.PUSHOVER_API_KEY as string

const blacklist = [ 'AIRBUS HELICOPTERS' ]
export function isBlacklisted(flight:FlightInfo):boolean {
  if (!flight.desc) return false
  return blacklist.some(phrase => flight.desc?.includes(phrase))
}