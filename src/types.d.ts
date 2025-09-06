export type FlightInfo = {
  hex: string
  type: string
  flight?: string
  r?: string
  t?: string
  dbFlags: number
  desc?: string
  ownOp?: string
  alt_baro: number | 'ground'
  alt_geom?: number
  track?: number
  squawk?: string
  emergency?: string
  category?: string
  lat: number
  lon: number
}
export type adsbOneRes = {
  ac: FlightInfo[]
  msg: string
  now: number
}

export type PlaneSpotterRes = {
  photos: Array<{
    id: string
    thumbnail: {
      src: string
      size: { width: number, height: number }
    }
    thumbnail_large: {
      src: string
      size: { width: number, height: number }
    }
    link: string
    photographer: string
  }>
}
export interface PlaneInfo { thumbnail: string, link: string }

export type DiscordWebhook = {
  content: string
  embeds: Array<{
    color: number
    fields: Array<{
      name: string
      value: string
      inline: boolean
    }>
    image: { url: string } | undefined
  }>
  attachments: Array<any>
}