import 'dotenv/config'

import { baseUrl, coord, radius, int, isBlacklisted, whUrl } from './config'
import type { adsbOneRes } from './types'
import { getPlaneInfo } from './services/planeInfo'
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
          console.log(`   Reg: ${flight.r || 'N/A'}`)
          console.log(`   Hex: ${flight.hex || 'N/A'}`)
          console.log(`   Alt: ${flight.alt_baro}ft`)
          console.log(`   Lat: ${flight.lat}`)
          console.log(`   Lon: ${flight.lon}`)

          const imgUrl = flight.r ? await getPlaneInfo(flight.r) : null
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