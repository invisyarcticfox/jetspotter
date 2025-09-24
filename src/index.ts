import 'dotenv/config'
import { baseUrl, coord, radius, secs, isBlacklisted, isWhitelisted } from './config'
import type { FlightData } from './types'
import { getPlanespotterInfo } from './services/planespotter'
import { sendDiscordWebhook, sendPushoverNotif } from './services/notifications'
import { sendToR2 } from './services/cloudflare'
import { updateSeen } from './utils'

let activeMilitary = new Set<string>()


async function getMilitary() {
  const now = `[${new Date().toLocaleString()}] -`

  try {
    const res = await fetch(`${baseUrl}/${coord.lat}/${coord.lon}/${radius}`)
    const d:FlightData = await res.json()
    const { ac: flights } = d

    if ( !flights || flights.length === 0 ) { return }

    const currentMilitary = new Set<string>()

    for (const flight of flights) {
      if (flight.dbFlags === 1 || isWhitelisted(flight) && !isBlacklisted(flight)) {
        currentMilitary.add(flight.hex)

        if (!activeMilitary.has(flight.hex)) {
          console.log(`${now} Military aircraft detected!`)
          console.log(`   Operator: ${flight.ownOp || 'N/A'}`)
          console.log(`   Type: ${flight.desc || 'N/A'}`)
          console.log(`   Callsign: ${flight.flight || 'N/A'}`)
          console.log(`   Reg: ${flight.r || 'N/A'}`)
          console.log(`   Alt: ${flight.alt_baro || 'N/A'}ft`)
          console.log(`   Lat Lon: ${flight.lat || 'N/A'}, ${flight.lon || 'N/A'}`)
          console.log(`   Track: ${flight.track || 'N/A'}`)
          console.log(`   Speed: ${flight.gs || 'N/A'}kts`)

          const imgUrl = flight.r ? await getPlanespotterInfo(flight.r) : null
          await sendDiscordWebhook(flight, imgUrl)
          await sendPushoverNotif(flight, imgUrl)
          updateSeen(flight.r || 'N/A', flight.desc || 'N/A', flight.ownOp || 'N/A')
          await sendToR2()
          console.log(`===============`)
        }
      }
    }
    activeMilitary = currentMilitary
  } catch (error) { console.error(error) }
}


console.log('Script started. Watching for military aircraft.')
setInterval(getMilitary, secs)

getMilitary()