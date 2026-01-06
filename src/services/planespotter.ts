import type { PlaneSpotters, PlaneSpottersPhoto, PlaneInfo } from '../types'
import { timeout } from '../utils'


export async function getPlanespottersImage({hex,r,t}:PlaneInfo):Promise<PlaneSpottersPhoto|null> {
  try {
    const url = new URL(`https://api.planespotters.net/pub/photos/hex/${hex}`)
    if (r) url.searchParams.set('reg', r)
    if (t) url.searchParams.set('icaoType', t)
    
    const res = await fetch(url, { signal:timeout() })
    if (!res.ok) {
      console.error(`Failed to fetch planespotters.net`, res.status, res.statusText)
      return null
    }
    const {photos}:PlaneSpotters = await res.json()

    if (photos && photos.length > 0) {
      const photo = photos[0]
      return {
        thumbnail: { small: photo.thumbnail.src, large: photo.thumbnail_large.src },
        link: photo.link,
        photographer: photo.photographer
      }
    }
    return null
  } catch (error) {
    console.error('Error when fetching planespotters photo:', error)
    return null
  }
}