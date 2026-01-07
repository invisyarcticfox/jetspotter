import type { PlaneContext } from '../types'
import { env } from '../config'
import { logMsg } from '../utils'


export async function sendPushoverNotif({plane, category, adsbdb, thumb}:PlaneContext) {
  try {
    const formData = new FormData()

    formData.append('token', env.pushover.token)
    formData.append('user', env.pushover.user)
    formData.append('title', `${category} Aircraft Spotted`)
    formData.append('message', `A ${plane.ownOp ?? adsbdb?.operator ?? 'N/A'} ${plane.desc ?? adsbdb?.type ?? 'N/A'} at ${plane.alt_baro ?? 'N/A'}ft`)
    formData.append('url', `https://globe.adsbexchange.com/?icao=${plane.hex}`)
    formData.append('url_title', `${plane.r ?? plane.hex} on adsbexchange`)

    if (thumb) {
      const img = await fetch(thumb.thumbnail.large)
      formData.append('attachment', await img.blob(), `${plane.r ?? plane.hex}.jpg`)
    }

    const res = await fetch('https://api.pushover.net/1/messages.json', { method:'POST', body:formData })
    if (!res.ok) console.error('Failed to fetch Pushover:', res.status, res.statusText)
    const d = await res.json()

    if (d.status === 1) { logMsg('Sent Pushover notification.')
    } else { console.log(d) }
  } catch (error) { console.error('CRIT pushover error:', error) }
}