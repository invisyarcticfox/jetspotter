import type { AirplanesLive, Planespotters } from '~/types'
import { timeout } from '~/utils'
import pkg from '~/../package.json'


export async function getPlanespotters(plane:AirplanesLive['ac'][number]):Promise<Planespotters['photos'][number]|null> {
  try {
    const url = new URL(`https://api.planespotters.net/pub/photos/hex/${plane.hex}`)
    if (plane.r) url.searchParams.set('reg', plane.r)
    if (plane.t) url.searchParams.set('icaoType', plane.t)

    const res = await fetch(url, {
      signal: timeout(),
      headers: { 'User-Agent' : `InvisyArcticFox/JetSpotter v${pkg.version} (lucas@itaf.uk https://itaf.uk)` }
    })
    if (!res.ok) {
      console.error(`Failed to fetch ${res.url}:`, res.status, res.statusText)
      return null
    }

    const {photos}:Planespotters = await res.json()
    if (photos && photos.length) return photos[0]

    return null
  } catch (error) {
    console.error('PLANESPOTTERS ERROR:', error)
    return null
  }
}