import type { AdsbDb } from '~/types'
import { timeout } from '~/utils'


export async function getAdsbDb(hex:string):Promise<AdsbDb['response']['aircraft']|null> {
  try {
    const res = await fetch(`https://api.adsbdb.com/v0/aircraft/${hex}`, { signal: timeout() })
    if (!res.ok) {
      console.warn(`ADSBDB API returned ${res.status} for ${res.url}`)
      return null
    }
    const {response:{aircraft}}:AdsbDb = await res.json()
    return aircraft
  } catch (error) {
    console.error(`ADSBDB ERROR`, error)
    return null
  }
}