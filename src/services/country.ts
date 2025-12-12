import type { ADSBdb, FlightInfo } from '../types'


export async function getRegCountry(flight:FlightInfo):Promise<string|null> {
  const baseUrl = `https://api.adsbdb.com/v0/aircraft/${flight.hex}`

  try {
    let res = await fetch(baseUrl)
    if (res.ok) {
      const d:ADSBdb = await res.json()
      const country = d.response.aircraft.registered_owner_country_name
      if (country) return country
      return null
    } else if (res.status !== 404) {
      console.warn(`ADSBDB API returned ${res.status} for ${baseUrl}`)
      return null
    }

    if (flight.flight && flight.flight !== 'N/A') {
      const url = new URL(baseUrl)
      url.searchParams.set('callsign', flight.flight)
      res = await fetch(url.toString())
      if (res.ok) {
        const d:ADSBdb = await res.json()
        const country = d.response.aircraft.registered_owner_country_name
        if (country) return country
      } else if (res.status !== 404) {
        console.warn(`ADSBDB API returned ${res.status} for ${url}`)
      }
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}