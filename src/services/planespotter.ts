import type { PlaneSpotter, PlanePhoto, FlightInfo } from '../types'


export async function getPlanespotterInfo(flight:FlightInfo): Promise<PlanePhoto | null> {
  try {
    const res = await fetch(`https://api.planespotters.net/pub/photos/hex/${flight.hex}` + (flight.r ? `?reg=${flight.r}` : ''))
    const d:PlaneSpotter = await res.json()
    if (!res.ok) return null

    if (d.photos && d.photos.length > 0) {
      const photo = d.photos[0]
      return {
        thumbnail: {
          small: photo.thumbnail.src,
          large: photo.thumbnail_large.src
        },
        link: photo.link
      }
    }
  } catch (error) { console.error(error) }
  return null
}