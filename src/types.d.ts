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
export type FlightData = { ac: FlightInfo[] | [], msg: string, now: number }

export type PlaneSpotter = {
  photos: {
    id: string
    thumbnail: { src: string, size: { width: number, height: number } }
    thumbnail_large: { src: string, size: { width: number, height: number } }
    link: string
    photographer: string
  }[]
}
export type PlanePhoto = {
  thumbnail: { small: string, large: string }
  link: string
}

export type AltitudeGradient = {
  offset: number
  altitude: number
  color: { h:number, s:number, l:number }
}

export type SeenData = {
  [hex:string]: {
    reg: string
    callsign: string
    type: string
    operator: string
    country?: string
    seenCount: number
    lastSeen: string
  }
}

export type ADSBdb = {
  response: {
    aircraft: {
      type: string
      icao_type: string
      manufacturer: string
      mode_s: string
      registration: string
      registered_owner_country_iso_name: string
      registered_owner_country_name: string
      registered_owner_operator_flag_code: string
      registered_owner: string
    }
  }
}