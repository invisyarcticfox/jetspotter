import type { HexColorString } from 'discord.js'
import { config } from '~/config'
import type { CTX } from '~/types'
type HSL = { h:number, s:number, l:number }


const altGradient:{altitude:number, color:HSL}[] = [
  { altitude: 0,     color: { h:23.125, s:88, l:51.04 } },
  { altitude: 500,   color: { h:23.125, s:88, l:51.04 } },
  { altitude: 1000,  color: { h:26.25,  s:88, l:52.08 } },
  { altitude: 2000,  color: { h:32.5,   s:88, l:53.87 } },
  { altitude: 4000,  color: { h:43,     s:88, l:51.5  } },
  { altitude: 6000,  color: { h:54,     s:88, l:44.8  } },
  { altitude: 8000,  color: { h:72,     s:88, l:41.8  } },
  { altitude: 10000, color: { h:112.5,  s:88, l:41    } },
  { altitude: 20000, color: { h:189.65, s:88, l:43.86 } },
  { altitude: 30000, color: { h:244.83, s:88, l:57.03 } },
  { altitude: 40000, color: { h:300,    s:88, l:43    } },
  { altitude: 50000, color: { h:360,    s:88, l:58.04 } },
]
// from https://globe.adsbexchange.com

const compass = [ '↑', '↗', '→', '↘', '↓', '↙', '←', '↖', ] as const
const getCompassArrow = (deg:number):string => compass[Math.round(deg / 45) % 8]

function hslToHex({h,s,l}:HSL):HexColorString {
  s /= 100
  l /= 100

  const k = (n:number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n:number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

  const r = Math.round(255 * f(0))
  const g = Math.round(255 * f(8))
  const b = Math.round(255 * f(4))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}


export function getAltColour(alt:CTX['plane']['alt']):HexColorString {
  if (!alt || alt === 'ground') return '#737373'

  let upper = altGradient[altGradient.length - 1]
  let lower = altGradient[0]

  for (let i = 0; i < altGradient.length; i++) {
    if (altGradient[i].altitude >= alt) {
      upper = altGradient[i]
      lower = i > 0 ? altGradient[i - 1] : altGradient[0]
      break
    }
  }
  
  if (alt >= upper.altitude) return hslToHex(upper.color)
  if (alt <= lower.altitude) return hslToHex(lower.color)

  const ratio = (alt - lower.altitude) / (upper.altitude - lower.altitude)

  const hsl = {
    h: lower.color.h + (upper.color.h - lower.color.h) * ratio,
    s: lower.color.s + (upper.color.s - lower.color.s) * ratio,
    l: lower.color.l + (upper.color.l - lower.color.l) * ratio
  }

  return hslToHex(hsl)
}

function formatAltitude({alt, baro_rate, geo_rate}:CTX['plane']):string {
  if (alt === 'ground') return 'Ground'
  const rate = geo_rate ?? baro_rate
  const str = `${alt.toLocaleString()}ft`

  if (rate == null) return str
  if (rate >= 300) return `${str} ↑`
  if (rate <= -300) return `${str} ↓`

  return str
}

function formatHeadingDir(head:CTX['plane']['heading']):string {
  if (!head) return 'N/A'
  return `${head.toFixed(0)}° ${getCompassArrow(head)}`
}

function formatCoords(plane:CTX['plane']):string {
  if (!plane.lat && !plane.lon) return 'N/A'

  const relLat = plane.lat - Number(config.coords.lat)
  const relLon = plane.lon - Number(config.coords.lon)
  let bearing = Math.atan2(relLon, relLat) * 180 / Math.PI
  if (bearing < 0) bearing += 360

  return `${plane.lat.toFixed(3)}, ${plane.lon.toFixed(3)} ${getCompassArrow(bearing)}`
}

export const format = {
  altitude: formatAltitude,
  heading: formatHeadingDir,
  coords: formatCoords
}