import { PlaneInfo, ADSBdbRes, PlaneSpottersPhoto } from './http'
import { PlaneSeenInfo } from '.'


export type PlaneContext = {
  plane: PlaneInfo,
  category: 'Military'|'Whitelisted'
  adsbdb?: ADSBdbRes|null
  thumb?: PlaneSpottersPhoto|null
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
    photographer?: string
  }
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
  seenCount: number
  lastSeen: string
  photographed: number|null
  photographer: string|null
}