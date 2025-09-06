import 'dotenv/config'

import type { DiscordWebhook, FlightInfo, PlaneInfo } from '../types'
import { whUrl } from '../config'


export async function sendWebhook(flight:FlightInfo, imgData:PlaneInfo | null) {
  const csLink = imgData?.link ? `[${flight.r || 'N/A'}](${imgData.link})` : (flight.r || 'N/A')
  const regLink = flight.flight ? `[${flight.flight}](https://globe.adsbexchange.com/?icao=${flight.hex})` : 'N/A'

  const body:DiscordWebhook = {
    content: ':airplane: Military Aircraft Spotted! :airplane:',
    embeds: [
      {
        color: 10937249,
        fields: [
          { name: 'Callsign', value: csLink, inline: true },
          { name: 'Registration', value: regLink, inline: true },
          { name: 'Altitude', value: flight.alt_baro ? `${flight.alt_baro}ft` : 'N/A', inline: true },
          { name: 'Type', value: flight.desc || 'N/A', inline: false },
          { name: 'Operator', value: flight.ownOp || 'N/A', inline: false },
        ],
        image: imgData?.thumbnail ? { url: imgData.thumbnail } : undefined
      }
    ],
    attachments: []
  }

  try {
    await fetch(whUrl as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    console.log(`   Sent Discord Webhook message!`)
  } catch (error) { console.error(error) }
}