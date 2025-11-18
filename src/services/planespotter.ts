import type { PlaneSpotter, PlanePhoto, FlightInfo } from '../types'


export async function getPlanespotterInfo(flight:FlightInfo):Promise<PlanePhoto | null> {
  try {
    const url = new URL(`https://api.planespotters.net/pub/photos/hex/${flight.hex}`)
    if (flight.r) url.searchParams.set('reg', flight.r)
    if (flight.t) url.searchParams.set('icaoType', flight.t)

    const res = await fetch(url)
    if (!res.ok) {
      console.error('Failed to fetch planespottes.net:', res.status, res.statusText)
      return null
    }
    const d:PlaneSpotter = await res.json()

    if (d.photos && d.photos.length > 0) {
      const photo = d.photos[0]
      return {
        thumbnail: { small: photo.thumbnail.src, large: photo.thumbnail_large.src },
        link: photo.link
      }
    }
  } catch (error) {
    console.error('CRIT planespotter error:', error)
    return null
  }
  return null
}