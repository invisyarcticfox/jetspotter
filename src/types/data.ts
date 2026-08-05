export type CTX = {
  plane: {
    hex: string
    reg?: string
    callsign?: string|null
    type?: string
    operator?: string
    alt: number|'ground'
    baro_rate?: number
    geo_rate?: number
    gs?: number
    lat: number
    lon: number
    heading?: number
    source?: string
    country?: string
  },
  category: 'Military'|'Whitelisted',
  thumb?: {
    photo: string
    photographer: string
  }|null
  db?: {
    seenCount: number,
    lastSeen: string,
    photographed: boolean
  }|null
}

export type DB = {
  hex: string
  reg: string|null
  type: string|null
  operator: string|null
  country: string|null
  seenCount: number
  lastSeen: string
  photographed: number
  photographer: string|null
}

export type WhiteBlackList = {
  whitelist: { registration:string[], type:string[] },
  blacklist: { registration:string[], type:string[] }
}
export type LoadedLists = {
  whitelist: { registration:Set<string>, type:Set<string> }
  blacklist: { registration:Set<string>, type:Set<string> }
}


export enum DbFlags {
  Military = 1,
  Interesting = 2,
  PIA = 4,
  LADD = 8
}