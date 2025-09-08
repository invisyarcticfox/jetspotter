import type { PlaneSpotterRes, PlaneInfo } from '../types'


export async function getPlanespotterInfo(reg:string): Promise<PlaneInfo | null> {
  try {
    const res = await fetch(`https://api.planespotters.net/pub/photos/reg/${reg}`)
    const d:PlaneSpotterRes = await res.json()
    if (!res.ok) return null

    if (d.photos && d.photos.length > 0) {
      const photo = d.photos[0]
      return { thumbnail: photo.thumbnail.src, link: photo.link }
    }
  } catch (error) { console.error(error) }
  return null
}