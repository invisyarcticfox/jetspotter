import 'dotenv/config'
import { FlightInfo, PlaneInfo } from '../types'
import { whUrl } from '../config'
import { getAltitudeColour } from './getAltColour'
import { WebhookClient } from 'discord.js'


export async function sendWebhook(flight:FlightInfo, imgData:PlaneInfo | null) {
  const csLink = flight.flight ? `[${flight.flight}](https://globe.adsbexchange.com/?icao=${flight.hex})` : 'N/A'
  const regLink = imgData?.link ? `[${flight.r || 'N/A'}](${imgData.link})` : flight.r || 'N/A'

  try {
    const webhookClient = new WebhookClient({ url: whUrl as string })

    await webhookClient.send({
      content: ':airplane: Military Aircraft Spotted! :airplane:',
      embeds: [
        {
          color: getAltitudeColour(flight.alt_baro),
          fields: [
            { name: 'Callsign', value: csLink, inline: true },
            { name: 'Callsign', value: regLink, inline: true },
          { name: 'Altitude', value: `${flight.alt_baro}ft` || 'N/A', inline: true },
          { name: 'Speed', value: `~${(flight.mach * 661.47)}kts` || 'N/A', inline: true },
          { name: 'Lat', value: `${flight.lat}` || 'N/A', inline: true },
          { name: 'Lon', value: `${flight.lon}` || 'N/A', inline: true },
          { name: 'Type', value: flight.desc || 'N/A', inline: false },
          { name: 'Operator', value: flight.ownOp || 'N/A', inline: false },
          ],
          image: imgData?.thumbnail? { url: imgData.thumbnail } : undefined
        }
      ]
    })
    console.log(`   Sent Discord Webhook message!`)
  } catch (error) { console.error(error) }
}