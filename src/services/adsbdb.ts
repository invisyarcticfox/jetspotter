import type { ADSBdb, ADSBdbRes, PlaneInfo } from '../types'
import { logMsg, sleep, timeout } from '../utils'


export async function getPlaneDB({hex, flight}:PlaneInfo):Promise<ADSBdbRes|null> {
  const baseUrl = `https://api.adsbdb.com/v0/aircraft/${hex}`

  try {
    let res = await fetch(baseUrl, { signal:timeout() })
    if (res.ok) {
      const {response:{aircraft}}:ADSBdb = await res.json()
      return {
        country: aircraft.registered_owner_country_name,
        operator: aircraft.registered_owner
      }
    } else { logMsg(`ADSBDB API returned ${res.status} for ${baseUrl}`, 'warn') }

    if (!flight?.trim()) return null
    await sleep(1000)

    const url = new URL(baseUrl)
    url.searchParams.set('callsign', flight)
    res = await fetch(url, { signal:timeout() })
    if (res.ok) {
      const {response:{aircraft}}:ADSBdb = await res.json()
      return {
        country: aircraft.registered_owner_country_name,
        operator: aircraft.registered_owner
      }
    } else {
      logMsg(`ADSBDB API returned ${res.status} for ${url}`, 'warn')
      return null
    }
  } catch (error) {
    console.error('Error when fetching reg country:', error)
    return null
  }
}