export type PlaneInfo = {
  hex: string
  type: string
  flight?: string
  r?: string
  t?: string
  desc?: string
  alt_baro?: number|'ground'
  alt_geom?: number
  gs?: number
  ias?: number
  tas?: number
  mach?: number
  track?: number
  track_rate?: number
  roll?: number
  mag_heading?: number
  true_heading?: number
  baro_rate?: number
  geom_rate?: number
  squawk?: string
  emergency?: string
  category?: string
  nav_qnh?: number
  nav_altitude_mcp?: number
  nav_altitude_fms?: number
  nav_heading?: number
  lat: number
  lon: number
  nic: number
  rc: number
  seen_pos: number
  version?: number
  nic_baro?: number
  nac_p?: number
  nac_v?: number
  sil?: number
  sil_type?: string
  gva?: number
  sda?: number
  alert?: number
  spi?: number
  mlat: string[]
  tisb: string[]
  messages: number
  seen: number
  rssi: number
  dst: number
  dir: number
  wd?: number
  ws?: number
  oat?: number
  tat?: number
  ownOp?: string
  year?: string
  dbFlags?: number
  nav_modes?: string[]
  calc_track?: number
}
export type AirplanesDotLive = {
  ac: PlaneInfo[]
  msg: string
  now: number
  total: number
  ctime: number
  ptime: number
}

export type PlaneSpotters = {
  photos: {
    id: string
    thumbnail: { src:string, size: { width:number, height:number } }
    thumbnail_large: { src:string, size: { width:number, height:number } }
    link: string
    photographer: string
  }[]
}
export type PlaneSpottersPhoto = {
  thumbnail: { small:string, large:string }
  link: string,
  photographer: string
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
      url_photo: string|null
      url_photo_thumbnail: string|null
    }
  }
}
export type ADSBdbRes = { country:string, operator:string }

export type DiscordEmbedField = { name:string, value:string, inline:boolean }
export type DiscordEmbed = {
  color: string,
  fields: DiscordEmbedField[],
  image: { url:string } | null,
  footer: { text:string }
}
export type DiscordButtons = { name:string, link:string|null, row:number}

export type AltGradient = { altitude:number, color: { h:number, s:number, l:number } }

export type PlaneContext = {
  plane: PlaneInfo,
  category: 'Military'|'Whitelisted'
  adsbdb?: ADSBdbRes | null
  thumb?: PlaneSpottersPhoto | null
  seenInfo: PlaneSeenInfo
}

export type SeenData = {
  [hex:string]: {
    reg: string
    callsign: string
    type: string
    operator: string
    country: string
    category?: string
    seenCount: number
    lastSeen: string
    photographed?: boolean
  }
}

export type PlaneSeenInfo = {
  seenCount: number | null
  lastSeen: string | null
  photographed: boolean
}