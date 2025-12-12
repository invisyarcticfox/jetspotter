import type { FlightInfo, PlanePhoto } from '../types'
import { poUserKey, poApiKey } from '../config'
import { formatAltitude, formatTrackDirection, getAltitudeColour, getSeen } from '../utils'
import pkg from '../../package.json'


export async function sendDiscordWebhook(flight:FlightInfo, imgData:PlanePhoto | null, category:string) {
  const seenTxt = getSeen(flight)

  const fields:{ name:string, value:string, inline?:boolean }[] = [
    { name: 'Callsign', value: `${flight.flight?.trim() || 'N/A'}`, inline: true },
    { name: 'Registration', value: `${flight.r?.trim() || 'N/A'}`, inline: true },
    { name: 'Altitude', value: formatAltitude(flight), inline: true },
    { name: 'Speed', value: flight.gs ? `${flight.gs}kts` : 'N/A', inline: true },
    { name: 'Lat Lon', value: `${flight.lat.toFixed(2)}, ${flight.lon.toFixed(2)}`, inline: true },
    { name: 'Track', value: formatTrackDirection(flight), inline: true },
    { name: 'Type', value: flight.desc || 'N/A', inline: false },
    { name: 'Operator', value: flight.ownOp || 'N/A', inline: true },
  ]
  if (seenTxt) fields.push({ name: 'Seen Before', value: seenTxt, inline: true })

  const embed = {
    color: getAltitudeColour(flight.alt_baro),
    fields,
    image: imgData ? { url: imgData.thumbnail.small } : undefined,
    footer: { text: `Version ${pkg.version}` }
  }
  const buttons = {
    adsbexchange: `https://globe.adsbexchange.com/?icao=${flight.hex}`,
    planespotters: imgData ? imgData.link : undefined
  }
  

  try {
    const res = await fetch('http://raspi:3621/jetspotter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, embed, buttons })
    })
    
    if (!res.ok) { console.error('Discord POST Failed', await res.text())
    } else { console.log('   Discord POST Success!') }
  } catch (error) { console.error('CRIT discord error:', error) }
}

export async function sendPushoverNotif(flight:FlightInfo, imgData:PlanePhoto | null, category:string) {
  try {
    const formData = new FormData()

    formData.append('token', poApiKey as string)
    formData.append('user', poUserKey as string)
    formData.append('title', `${category} Aircraft Spotted`)
    formData.append('message', `a ${flight.desc} at ${flight.alt_baro}ft!`)
    formData.append('url', `https://globe.adsbexchange.com/?icao=${flight.hex}`)
    formData.append('url_title', `${flight.r} on adsbexchange`)

    if (imgData) {
      const imgRes = await fetch(imgData.thumbnail.large)
      const blob = await imgRes.blob()
      formData.append('attachment', blob, `${flight.r}.jpg`)
    }

    const res = await fetch('https://api.pushover.net/1/messages.json', { method: 'POST', body: formData })
    if (!res.ok) console.error('Failed to fetch Pushover:', res.status, res.statusText)
    const d = await res.json()
    
    if (d.status === 1) { console.log('   Sent Pushover Notification!')
    } else { console.log(d) }
  } catch (error) {
    console.error('CRIT pushover error:', error)
  }
}