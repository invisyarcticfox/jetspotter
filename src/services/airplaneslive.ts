import type{ AirplanesLive } from '~/types'
import { timeout } from '~/utils'


export async function getAirplanesLive(hex:string):Promise<AirplanesLive['ac'][number]|null> {
  try {
    const res = await fetch(`https://api.airplanes.live/v2/hex/${hex}`, { signal: timeout() })
    const {ac:[plane]}:AirplanesLive = await res.json()
    return plane
  } catch (error) {
    console.error('AIRPLANESLIVE ERROR:', error)
    return null
  }
}