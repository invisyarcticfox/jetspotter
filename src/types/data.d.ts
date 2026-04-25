import { PlaneInfo, ADSBdbRes, PlaneSpottersPhoto } from './http'


export type PlaneContext = {
  plane: PlaneInfo,
  category: 'Military'|'Whitelisted'
  adsbdb?: ADSBdbRes|null
  thumb?: PlaneSpottersPhoto|null
  seenInfo: PlaneSeenInfo
}

export type PlaneSeenInfo = {
  seenCount: number|null
  lastSeen: string|null
  photographed: boolean
}

export type JetspotterData = {
  hex: string
  reg: string
  callsign: string
  type: string
  operator: string
  country: string
  category: string|null
  seenCount: number|null
  lastSeen: string|null
  photographed: number|null
  photographer: string|null
}

export type Lists = {
  whitelist: { desc: string[]; reg: string[] }
  blacklist: { desc: string[]; reg: string[] }
}