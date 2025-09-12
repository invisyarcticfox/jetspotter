import 'dotenv/config'
import type { FlightInfo, PlaneInfo } from '../types'
import { whUrl, poUserKey, poApiKey } from '../config'
import { getAltitudeColour } from './getAltColour'
import { WebhookClient } from 'discord.js'
import pkg from '../../package.json'

const webhookClient = new WebhookClient({ url: whUrl })


export async function sendDiscordWebhook(flight:FlightInfo, imgData:PlaneInfo | null) {
  const csLink = `[${flight.flight || 'N/A'}](https://globe.adsbexchange.com/?icao=${flight.hex})`
  const regLink = imgData?.link ? `[${flight.r}](${imgData.link})` : flight.r || 'N/A'
  const altVal = (() => {
    let altStr = `${flight.alt_baro}ft`
    if (flight.baro_rate != null) {
      if (flight.baro_rate! > 0) { altStr += ' ↑'
      } else if (flight.baro_rate! < 0) { altStr += ' ↓' }
    }
    return altStr
  })()
  const ktsSpeed = flight.mach ? `~${Math.round(flight.mach * 661.47)}kts` : 'N/A'

  try {
    await webhookClient.send({
      content: ':airplane: Military Aircraft Spotted! :airplane:',
      embeds: [
        {
          color: getAltitudeColour(flight.alt_baro),
          fields: [
            { name: 'Callsign', value: csLink, inline: true },
            { name: 'Registration', value: regLink, inline: true },
            { name: 'Altitude', value: altVal, inline: true },
            { name: 'Speed', value: ktsSpeed, inline: true },
            { name: 'Lat', value: `${flight.lat || 'N/A'}`, inline: true },
            { name: 'Lon', value: `${flight.lon || 'N/A'}`, inline: true },
            { name: 'Type', value: flight.desc || 'N/A', inline: false },
            { name: 'Operator', value: flight.ownOp || 'N/A', inline: false },
          ],
          image: imgData?.thumbnail? { url: imgData.thumbnail } : undefined,
          footer: { text: `Version ${pkg.version}` }
        }
      ]
    })
    console.log(`   Sent Discord Webhook message!`)
  } catch (error) { console.error(error) }
}

export async function sendPushoverNotif(flight:FlightInfo, imgData:PlaneInfo | null) {
  try {
    const formData = new FormData()

    formData.append('token', poApiKey)
    formData.append('user', poUserKey)
    formData.append('title', 'Military Aircraft Spotted')
    formData.append('message', `a ${flight.desc} at ${flight.alt_baro}ft!`)
    formData.append('url', `https://globe.adsbexchange.com/?icao=${flight.hex}`)
    formData.append('url_title', `${flight.r} on adsbexchange`)

    if (imgData?.thumbnail) {
      const imgRes = await fetch(imgData.thumbnail)
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