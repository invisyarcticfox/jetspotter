import type { ADSBdb, ADSBdbRes, PlaneInfo } from '~/types'
import { logMsg, sleep, timeout } from '~/utils'


export async function getADSBDB({hex, flight}:PlaneInfo):Promise<ADSBdbRes|null> {
  let adsbdb = `https://api.adsbdb.com/v0/aircraft/${hex}`
  let res
  
  try {
    res = await fetch(adsbdb, { signal:timeout() })
    if (res.ok) {
      const {response:{aircraft}}:ADSBdb = await res.json()
      return {
        type: aircraft.type,
        registration: aircraft.registration,
        country: aircraft.registered_owner_country_name,
        operator: aircraft.registered_owner
      }
    } else { logMsg(`ADSBDB API returned ${res.status} for ${adsbdb}`, 'warn') }

    if (!flight?.trim()) return null
    await sleep(1000)

    adsbdb += `?callsign=${flight.trim()}`
    res = await fetch(adsbdb, { signal:timeout() })
    if (res.ok) {
      const {response:{aircraft}}:ADSBdb = await res.json()
      return {
        type: aircraft.type,
        registration: aircraft.registration,
        country: aircraft.registered_owner_country_name,
        operator: aircraft.registered_owner
      }
    } else {
      logMsg(`ADSBDB API returned ${res.status} for ${adsbdb}`, 'warn')
      return null
    }
  } catch (error) {
    console.error('Error when fetching reg country:', error)
    return null
  }
}