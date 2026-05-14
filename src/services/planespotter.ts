import type { PlaneSpotters, PlaneSpottersPhoto, PlaneInfo } from '~/types'
import { timeout } from '~/utils'
import pkg from '../../package.json'


export async function getPlanespotter({hex, r:reg, t:type}:PlaneInfo):Promise<PlaneSpottersPhoto|null> {
  try {
    const url = new URL(`https://api.planespotters.net/pub/photos/hex/${hex}`)
    if (reg) url.searchParams.set('reg', reg)
    if (type) url.searchParams.set('icaoType', type)
    
    const res = await fetch(url, {
      signal:timeout(),
      headers: { 'User-Agent': `invisyarcticfox@JetSpotter/v${pkg.version} (lucas@itaf.uk https://itaf.uk)` }
    })
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