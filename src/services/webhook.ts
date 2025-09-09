import 'dotenv/config'
import { FlightInfo, PlaneInfo } from '../types'
import { whUrl } from '../config'
import { getAltitudeColour } from './getAltColour'
import { WebhookClient } from 'discord.js'

const webhookClient = new WebhookClient({ url: whUrl as string })


export async function sendWebhook(flight:FlightInfo, imgData:PlaneInfo | null) {
  const csLink = `[${flight.flight || 'N/A'}](https://globe.adsbexchange.com/?icao=${flight.hex})`
  const regLink = imgData?.link ? `[${flight.r}](${imgData.link})` : flight.r || 'N/A'
  const altVal = (() => {
    let altStr = `${flight.alt_baro}ft`
    if (flight.baro_rate !== null) {
      if (flight.baro_rate! > 0) { altStr += ' ↑'
      } else if (flight.baro_rate! < 0) { altStr += ' ↓' }
    }
    return altStr
  })()
  const machVal = flight.mach != null ? `~${Math.round(flight.mach * 661.47)}kts` : 'N/A'

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
            { name: 'Speed', value: machVal, inline: true },
            { name: 'Lat', value: `${flight.lat || 'N/A'}`, inline: true },
            { name: 'Lon', value: `${flight.lon || 'N/A'}`, inline: true },
            { name: 'Type', value: flight.desc || 'N/A', inline: false },
            { name: 'Operator', value: flight.ownOp || 'N/A', inline: false },
          ],
          image: imgData?.thumbnail? { url: imgData.thumbnail } : undefined,
          footer: { text: 'Version 1.0.2' }
        }
      ]
    })
    console.log(`   Sent Discord Webhook message!`)
  } catch (error) { console.error(error) }
}