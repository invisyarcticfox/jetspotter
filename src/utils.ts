import convert from 'color-convert'
import type { FlightInfo, AltitudeGradient } from './types'


export function formatAltitude(flight:FlightInfo):string {
  let altStr = `${flight.alt_baro}ft`
  if (flight.baro_rate != null) {
    if (flight.baro_rate > 0) {
      altStr += ' ↑'
    } else if (flight.baro_rate < 0) {
      altStr += ' ↓'
    }
  }
  return altStr
}

export function formatTrackDirection(flight:FlightInfo):string {
  if (!flight.track) { return 'N/A' }

  const deg = flight.track

  let arrow = null
  if (deg >= 337.5 || deg < 22.5) arrow = '↑'
  else if (deg >= 22.5 && deg < 67.5) arrow = '↗'
  else if (deg >= 67.5 && deg < 112.5) arrow = '→'
  else if (deg >= 112.5 && deg < 157.5) arrow = '↘'
  else if (deg >= 157.5 && deg < 202.5) arrow = '↓'
  else if (deg >= 202.5 && deg < 247.5) arrow = '↙'
  else if (deg >= 247.5 && deg < 292.5) arrow = '←'
  else if (deg >= 292.5 && deg < 337.5) arrow = '↖'

  return `${deg}° ${arrow}`
}


const gradient:AltitudeGradient[] = [
  { offset: 0, altitude: 0, color: { h: 23.125, s: 88, l: 51.04 } },
  { offset: 0.033, altitude: 500, color: { h: 23.125, s: 88, l: 51.04 } },
  { offset: 0.066, altitude: 1000, color: { h: 26.25, s: 88, l: 52.08 } },
  { offset: 0.126, altitude: 2000, color: { h: 32.5, s: 88, l: 53.88 } },
  { offset: 0.19, altitude: 4000, color: { h: 43, s: 88, l: 51.5 } },
  { offset: 0.253, altitude: 6000, color: { h: 54, s: 88, l: 44.8 } },
  { offset: 0.316, altitude: 8000, color: { h: 72, s: 88, l: 41.8 } },
  { offset: 0.38, altitude: 10000, color: { h: 112.5, s: 88, l: 41 } },
  { offset: 0.59, altitude: 20000, color: { h: 189.65, s: 88, l: 43.86 } },
  { offset: 0.79, altitude: 30000, color: { h: 244.83, s: 88, l: 57.03 } },
  { offset: 1, altitude: 40000, color: { h: 300, s: 88, l: 43 } },
]

export function hslToDec(h:number, s:number, l:number):number {
  const [ r, g, b ] = convert.hsl.rgb(h, s, l)
  return ( r << 16 ) + ( g << 8 ) + b
}

export function getAltitudeColour(altitude:number):number {
  if (!altitude) { return 0x808080 }

  let lowerStop:AltitudeGradient | null = null
  let upperStop:AltitudeGradient | null = null

  for (let i = 0; i < gradient.length; i++) {
    if (gradient[i].altitude >= altitude) {
      upperStop = gradient[i]
      if (i > 0) { lowerStop = gradient[i - 1]
      } else { lowerStop = gradient[0] }
      break
    }
  }

  if (!upperStop) {
    lowerStop = gradient[gradient.length - 1]
    upperStop = gradient[gradient.length - 1]
  }

  if (lowerStop === upperStop || altitude <= lowerStop!.altitude) {
    return hslToDec( lowerStop!.color.h, lowerStop!.color.s, lowerStop!.color.l )
  }

  const rangeAlt = upperStop.altitude - lowerStop!.altitude
  const relativeAlt = altitude - lowerStop!.altitude
  const ratio = rangeAlt === 0 ? 0 : relativeAlt / rangeAlt

  const interpH = lowerStop!.color.h + ( upperStop.color.h - lowerStop!.color.h ) * ratio
  const interpS = lowerStop!.color.s + ( upperStop.color.s - lowerStop!.color.s ) * ratio
  const interpL = lowerStop!.color.l + ( upperStop.color.l - lowerStop!.color.l ) * ratio

  return hslToDec( interpH, interpS, interpL )
}