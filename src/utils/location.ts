import convert from 'color-convert'
import type { PlaneInfo } from '../types'


export function formatAltitude({alt_baro, baro_rate}:PlaneInfo):string {
  if (!alt_baro) return 'N/A'
  let altStr = `${alt_baro}ft`
  if (baro_rate == null) { return altStr
  } else if (baro_rate > 0) { altStr += ' ↑'
  } else if (baro_rate < 0) { altStr += ' ↓' }
  return altStr
}


const compass:{max:number, arrow:string}[] = [
  { max: 22.5,  arrow: '↑' },
  { max: 67.5,  arrow: '↗' },
  { max: 112.5, arrow: '→' },
  { max: 157.5, arrow: '↘' },
  { max: 202.5, arrow: '↓' },
  { max: 247.5, arrow: '↙' },
  { max: 292.5, arrow: '←' },
  { max: 337.5, arrow: '↖' },
  { max: 360,   arrow: '↑' },
]

export function formatTrackDir({track}:PlaneInfo): string {
  if (track == null) return 'N/A'
  const {arrow} = compass.find(({max}) => track < max)!
  return `${track}° ${arrow}`
}


const gradient:{altitude:number, color: { h:number,s:number,l:number }}[] = [
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

function hslToHex({h,s,l}:{h:number,s:number,l:number}):string { return `#${convert.hsl.hex(h,s,l)}` }

export function getAltColour({alt_baro:altitude}:PlaneInfo):string {
  if (!altitude || altitude === 'ground') return '#808080'

  let lower = gradient[0]
  let upper = gradient[gradient.length - 1]

  for (let i = 0; i < gradient.length; i++) {
    if (gradient[i].altitude >= altitude) {
      upper = gradient[i]
      lower = i > 0 ? gradient[i - 1] : gradient[0]
      break
    }
  }
  
  if (altitude <= lower.altitude) { return hslToHex(lower.color) }
  if (altitude >= upper.altitude) { return hslToHex(upper.color) }

  
  const ratio = (altitude - lower.altitude) / (upper.altitude - lower.altitude)
  const newHsl = {
    h: lower.color.h + (upper.color.h - lower.color.h) * ratio,
    s: lower.color.s + (upper.color.s - lower.color.s) * ratio,
    l: lower.color.l + (upper.color.l - lower.color.l) * ratio
  }

  return hslToHex(newHsl)
}

export function formatCoords(local:{lat:string,lon:string},plane:PlaneInfo):string {
  if (!plane.lat && !plane.lon) return 'N/A'

  const relLat = plane.lat - Number(local.lat)
  const relLon = plane.lon - Number(local.lon)
  let bearing = (Math.atan2(relLon, relLat) * 180) / Math.PI
  if (bearing < 0) bearing += 360
  const { arrow } = compass.find(({ max }) => bearing < max)!
  return `${Number(local.lat).toFixed(2)}, ${Number(local.lon).toFixed(2)} ${arrow}`
}