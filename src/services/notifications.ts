import { WebhookClient } from 'discord.js'
import type { FlightInfo, PlanePhoto } from '../types'
import { whUrl, poUserKey, poApiKey } from '../config'
import { formatAltitude, formatTrackDirection, getAltitudeColour } from '../utils'
import pkg from '../../package.json'

const webhookClient = new WebhookClient({ url: whUrl as string })


export async function sendDiscordWebhook(flight:FlightInfo, imgData:PlanePhoto | null, category:string) {
  const csLink = `[${flight.flight?.trim() || 'N/A'}](https://globe.adsbexchange.com/?icao=${flight.hex})`
  const regLink = imgData ? `[${flight.r}](${imgData.link})` : flight.r || 'N/A'

  try {
    await webhookClient.send({
      content: `:airplane: ${category} Aircraft Spotted! :airplane:`,
      embeds: [
        {
          color: getAltitudeColour(flight.alt_baro),
          fields: [
            { name: 'Callsign', value: csLink, inline: true },
            { name: 'Registration', value: regLink, inline: true },
            { name: 'Altitude', value: formatAltitude(flight), inline: true },
            { name: 'Speed', value: `${flight.gs || 'N/A'}kts`, inline: true },
            { name: 'Lat Lon', value: `${flight.lat.toFixed(2)}, ${flight.lon.toFixed(2)}`, inline: true },
            { name: 'Track', value: formatTrackDirection(flight), inline: true },
            { name: 'Type', value: flight.desc?.replace(/\s*\(.*\)$/, '') || 'N/A', inline: false },
            { name: 'Operator', value: flight.ownOp || 'N/A', inline: false },
          ],
          image: imgData ? { url: imgData.thumbnail.small } : undefined,
          footer: { text: `Version ${pkg.version}` }
        }
      ]
    })
    console.log(`   Sent Discord Webhook message!`)
  } catch (error) { console.error(error) }
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

    const res = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      body: formData
    })
    const d = await res.json()
    
    if (d.status === 1) { console.log('   Sent Pushover Notification!')
    } else { console.log(d) }
  } catch (error) {
    console.error(error)
  }
}