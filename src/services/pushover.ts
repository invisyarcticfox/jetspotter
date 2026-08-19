import { config } from '~/config'
import type { CTX } from '~/types'
import { timeout } from '~/utils'


export async function sendToPushover({plane, thumb, category}:CTX) {
  try {
    const form = new FormData()
    form.set('token', config.pushover.token)
    form.set('user', config.pushover.user)
    form.append('title', `${category} Aircraft Spotted!`)
    form.append('message', `A ${plane.operator ?? 'N/A'} ${plane.type ?? 'N/A'} at ${plane.alt}ft`)
    form.append('url', `https://globe.adsbexchange.com/?icao=${plane.hex}`)
    form.append('url_title', `View ${plane.reg ?? 'N/A'} on ADSBExchange.com`)
    if (thumb) {
      const image = await fetch(thumb.photo)
      form.append('attachment', await image.blob(), `${plane.hex}.jpg`)
    }

    const res = await fetch('https://api.pushover.net/1/messages.json', {
      signal: timeout(),
      method: 'POST',
      body: form,
      headers: { 'User-Agent': config.userAgent }
    })
    if (!res.ok) return console.error('Pushover POST failed:', res.status, res.statusText)
    const d = await res.json()
    if (d.status === 1) console.log('Sent Pushover notification')
  } catch (error) { console.error('PUSHOVER ERROR:', error) }
}