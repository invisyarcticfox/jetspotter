import type { FlightInfo } from './types'

export const baseUrl = 'https://api.adsb.one/v2/point'
export const coord = {
  lat: process.env.COORD_LAT,
  lon: process.env.COORD_LON
}
export const radius = 20
export const int = 20000

export const whUrl = process.env.DISCORD_WEBHOOK_URL

const blacklist = [ 'AIRBUS HELICOPTER' ]
export function isBlacklisted(flight:FlightInfo):boolean {
  if (!flight.desc) return false
  return blacklist.some(phrase => flight.desc?.includes(phrase))
}