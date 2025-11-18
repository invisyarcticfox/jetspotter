import 'dotenv/config'
import { coord, radius, secs, isBlacklisted, isWhitelisted } from './config'
import type { FlightData } from './types'
import { getSeen, recentlySeen, updateSeen } from './utils'
import { getPlanespotterInfo } from './services/planespotter'
import { sendDiscordWebhook, sendPushoverNotif } from './services/notifications'
import { betterstackHeartbeat } from './services/heartbeat'

let activeFlights = new Set<string>()


async function getMilitary() {
  const now = `[${new Date().toLocaleString()}] -`

  try {
    const res = await fetch(`https://api.airplanes.live/v2/point/${coord.lat}/${coord.lon}/${radius}`)
    if (!res.ok) {
      await betterstackHeartbeat('fail')
      console.error('Failed to fetch api.airplanes.live:', res.status, res.statusText)
      return
    }
    const { ac:flights }:FlightData = await res.json()
    if (!flights || flights.length === 0) return

    const currentFlights = new Set<string>()

    for (const flight of flights) {
      if ((flight.dbFlags === 1 || isWhitelisted(flight)) && !isBlacklisted(flight)) {
        const category = flight.dbFlags === 1 ? 'Military' : 'Whitelisted'

        currentFlights.add(flight.hex)
        if (recentlySeen(flight)) continue

        if (!activeFlights.has(flight.hex)) {
          console.log(`${now} ${category} aircraft detected!`)
          console.log(`   Operator: ${flight.ownOp || 'N/A'}`)
          console.log(`   Type: ${flight.desc || 'N/A'}`)
          console.log(`   Callsign: ${flight.flight || 'N/A'}`)
          console.log(`   Reg: ${flight.r || 'N/A'}`)
          console.log(`   Alt: ${flight.alt_baro || 'N/A'}ft`)
          console.log(`   LatLon: ${flight.lat || 'N/A'}, ${flight.lon || 'N/A'}`)
          console.log(`   Track: ${flight.track || 'N/A'}`)
          console.log(`   Speed: ${flight.gs || 'N/A'}kts`)
          const seenTxt = getSeen(flight)
          if (seenTxt) console.log(`   Seen before ${seenTxt}`)

          const imgUrl = await getPlanespotterInfo(flight)
          await Promise.allSettled([
            sendDiscordWebhook(flight, imgUrl, category),
            sendPushoverNotif(flight, imgUrl, category),
          ])

          updateSeen(flight)
          console.log(`===============`)
        }
      }
    }

    await betterstackHeartbeat('ok')
    activeFlights = currentFlights
  } catch (error) {
    await betterstackHeartbeat('fail')
    console.error('CRIT jetspotter error:', error)
  }
}


console.log('Script started. Watching for matching aircraft.')
setInterval(getMilitary, secs)
getMilitary()