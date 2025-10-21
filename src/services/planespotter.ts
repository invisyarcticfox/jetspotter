import type { PlaneSpotter, PlanePhoto, FlightInfo } from '../types'


export async function getPlanespotterInfo(flight:FlightInfo): Promise<PlanePhoto | null> {
  try {
    const url = new URL(`https://api.planespotters.net/pub/photos/hex/${flight.hex}`)
    if (flight.r) url.searchParams.set('reg', flight.r)
    if (flight.t) url.searchParams.set('icaoType', flight.t)

    const res = await fetch(url)
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