import 'dotenv/config'
import { baseUrl, coord, radius, secs, isBlacklisted, isWhitelisted } from './config'
import type { FlightData } from './types'
import { getPlanespotterInfo } from './services/planespotter'
import { sendDiscordWebhook, sendPushoverNotif } from './services/notifications'
import { sendToR2 } from './services/cloudflare'

let activeFlights = new Set<string>()


async function getMilitary() {
  const now = `[${new Date().toLocaleString()}] -`

  try {
    const res = await fetch(`${baseUrl}/${coord.lat}/${coord.lon}/${radius}`)
    const d:FlightData = await res.json()
    const { ac: flights } = d

    if ( !flights || flights.length === 0 ) { return }

    const currentFlights = new Set<string>()

    for (const flight of flights) {
      if ((flight.dbFlags === 1 || isWhitelisted(flight)) && !isBlacklisted(flight)) {
        const category = flight.dbFlags === 1 ? 'Military' : 'Whitelisted'
        currentFlights.add(flight.hex)

        if (!activeFlights.has(flight.hex)) {
          console.log(`${now} ${category} aircraft detected!`)
          console.log(`   Operator: ${flight.ownOp || 'N/A'}`)
          console.log(`   Type: ${flight.desc || 'N/A'}`)
          console.log(`   Callsign: ${flight.flight || 'N/A'}`)
          console.log(`   Reg: ${flight.r || 'N/A'}`)
          console.log(`   Alt: ${flight.alt_baro || 'N/A'}ft`)
          console.log(`   Lat Lon: ${flight.lat || 'N/A'}, ${flight.lon || 'N/A'}`)
          console.log(`   Track: ${flight.track || 'N/A'}`)
          console.log(`   Speed: ${flight.gs || 'N/A'}kts`)

          const imgUrl = await getPlanespotterInfo(flight)
          await sendDiscordWebhook(flight, imgUrl, category)
          await sendPushoverNotif(flight, imgUrl, category)
          await sendToR2(flight.r || 'N/A', flight.desc || 'N/A', flight.ownOp || 'N/A')
          console.log(`===============`)
        }
      }
    }
    activeFlights = currentFlights
  } catch (error) { console.error(error) }
}


console.log('Script started. Watching for matching aircraft.')
setInterval(getMilitary, secs)
getMilitary()