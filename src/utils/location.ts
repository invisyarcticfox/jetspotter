import type { HexColorString } from 'discord.js'
import { config } from '~/config'
import type { CTX } from '~/types'


const altHue:{ altitude:number, hue:number }[] = [
  { altitude: 0,      hue: 20    },
  { altitude: 2000,   hue: 32.5  },
  { altitude: 4000,   hue: 43    },
  { altitude: 6000,   hue: 54    },
  { altitude: 8000,   hue: 72    },
  { altitude: 9000,   hue: 85    },
  { altitude: 11000,  hue: 140   },
  { altitude: 40000,  hue: 300   },
  { altitude: 51000,  hue: 360   },
]
const hueLight:{ hue:number, lightness:number }[] = [
  { hue: 0,   lightness: 53 },
  { hue: 20,  lightness: 50 },
  { hue: 32,  lightness: 54 },
  { hue: 40,  lightness: 52 },
  { hue: 46,  lightness: 51 },
  { hue: 50,  lightness: 46 },
  { hue: 60,  lightness: 43 },
  { hue: 80,  lightness: 41 },
  { hue: 100, lightness: 41 },
  { hue: 120, lightness: 41 },
  { hue: 140, lightness: 41 },
  { hue: 160, lightness: 40 },
  { hue: 180, lightness: 40 },
  { hue: 190, lightness: 44 },
  { hue: 198, lightness: 50 },
  { hue: 200, lightness: 58 },
  { hue: 220, lightness: 58 },
  { hue: 240, lightness: 58 },
  { hue: 255, lightness: 55 },
  { hue: 266, lightness: 55 },
  { hue: 270, lightness: 58 },
  { hue: 280, lightness: 58 },
  { hue: 290, lightness: 47 },
  { hue: 300, lightness: 43 },
  { hue: 310, lightness: 48 },
  { hue: 320, lightness: 48 },
  { hue: 340, lightness: 52 },
  { hue: 360, lightness: 53 },
]
// taken from https://github.com/wiedehopf/tar1090/blob/b018536/html/planeObject.js#L761
// and https://github.com/wiedehopf/tar1090/blob/b018536/html/defaults.js#L120

function interp(value:number, points: { value:number, output:number }[]):number {
  if (value <= points[0].value) return points[0].output

  for (let i = 1; i < points.length; i++) {
    const upper = points[i]
    const lower = points[i - 1]

    if (value <= upper.value) {
      const ratio = (value - lower.value) / (upper.value - lower.value)
      return lower.output + (upper.output - lower.output) * ratio
    }
  }

  return points[points.length - 1].output
}

const altToHue = (alt:number):number => { return interp(alt, altHue.map(point => ({ value: point.altitude, output: point.hue }))) }
const hueToLight = (hue:number):number => { return interp(hue, hueLight.map(point => ({ value: point.hue, output: point.lightness }))) }


const compass = [ '↑', '↗', '→', '↘', '↓', '↙', '←', '↖', ] as const
const getCompassArrow = (deg:number):string => compass[Math.round(deg / 45) % 8]

function hslToHex({h,s,l}:{ h:number, s:number, l:number }):HexColorString {
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
  if (alt === 'ground') return hslToHex({ h:200, s:0, l:30 })
  if (alt == null) return hslToHex({ h:0, s:0, l:75 })

  const altitude = Number(alt)
  if (!Number.isFinite(altitude)) return hslToHex({ h:0, s:0, l:75 })

  const hue = altToHue(altitude)
  const light = hueToLight(hue)

  return hslToHex({ h:hue, s:88, l:light })
}

export function formatAltitude({alt, baro_rate, geo_rate}:CTX['plane']):string {
  if (alt === 'ground') return 'Ground'
  const rate = geo_rate ?? baro_rate
  const str = `${alt.toLocaleString()}ft`

  if (rate == null) return str
  if (rate >= 300) return `${str} ↑`
  if (rate <= -300) return `${str} ↓`

  return str
}

export function formatHeadingDir(head:CTX['plane']['heading']):string {
  if (!head) return 'N/A'
  return `${head.toFixed(0)}° ${getCompassArrow(head)}`
}

export function formatCoords(plane:CTX['plane']):string {
  if (!plane.lat && !plane.lon) return 'N/A'

  const relLat = plane.lat - Number(config.coords.lat)
  const relLon = plane.lon - Number(config.coords.lon)
  let bearing = Math.atan2(relLon, relLat) * 180 / Math.PI
  if (bearing < 0) bearing += 360

  return `${plane.lat.toFixed(3)}, ${plane.lon.toFixed(3)} ${getCompassArrow(bearing)}`
}