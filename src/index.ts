import 'dotenv/config'
import { baseUrl, coord, radius, int, isBlacklisted } from './config'
import type { adsbOneRes } from './types'
import { getPlanespotterInfo } from './services/planespotterInfo'
import { sendWebhook } from './services/webhook'

let activeMilitary = new Set<string>()


async function getMilitary() {
  const now = `[${new Date().toLocaleString()}] -`

  console.log(`${now} No aircraft found.`)

  try {
    const res = await fetch(`${baseUrl}/${coord.lat}/${coord.lon}/${radius}`)
    const d:adsbOneRes = await res.json()
    const { ac: flights } = d

    if ( !flights || flights.length === 0 ) {
      console.log(`${now} No aircraft found.`)
      return
    }

    const currentMilitary = new Set<string>()

    for (const flight of flights) {
      if (flight.dbFlags && !isBlacklisted(flight)) {
        currentMilitary.add(flight.hex)

        if (!activeMilitary.has(flight.hex)) {
          console.log(`${now} Military aircraft detected!`)
          console.log(`   Operator: ${flight.ownOp || 'N/A'}`)
          console.log(`   Type: ${flight.desc || 'N/A'}`)
          console.log(`   Callsign: ${flight.flight || 'N/A'}`)
          console.log(`   Reg: ${flight.r || 'N/A'}`)
          console.log(`   Alt: ${flight.alt_baro}ft`)
          console.log(`   Lat: ${flight.lat}`)
          console.log(`   Lon: ${flight.lon}`)
          console.log(`   Speed: ${flight.mach ? `~${Math.round(flight.mach * 661.47)}kts` : 'N/A'}`)

          const imgUrl = flight.r ? await getPlanespotterInfo(flight.r) : null
          await sendWebhook(flight, imgUrl)
          console.log(` ===============`)
        }
      }
    }
    activeMilitary = currentMilitary
  } catch (error) { console.error(error) }
}


console.log('script started. watching for military aircraft.')
setInterval(getMilitary, int)

getMilitary()