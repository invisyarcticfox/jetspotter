export type FlightInfo = {
  hex: string
  type: string
  flight?: string
  r?: string
  t?: string
  dbFlags: number
  desc?: string
  ownOp?: string
  alt_baro: number
  gs?: number
  ias?: number
  tas?: number
  mach?: number
  track: number
  baro_rate?: number
  lat: number
  lon: number
}
export type FlightData = { ac: FlightInfo[], msg: string, now: number }

export type PlaneSpotter = {
  photos: Array<{
    id: string
    thumbnail: { src: string, size: { width: number, height: number } }
    thumbnail_large: { src: string, size: { width: number, height: number } }
    link: string
    photographer: string
  }>
}
export type PlaneInfo = { thumbnail: string, link: string }

export type AltitudeGradient = {
  offset: number
  altitude: number
  color: { h:number, s:number, l:number }
}

export type SeenData = Record<string, { type: string, operator: string, seenCount: number, lastSeen: string }>