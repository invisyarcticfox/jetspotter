import 'dotenv/config'
import { coords, radius, secs, isWhitelisted, isBlacklisted } from './config'
import type { AirplanesDotLive, PlaneContext } from './types'
import { logKV, updateSeen, recentlySeen, timeout, getSeenInfo } from './utils'
import { getADSBDB, getPlanespotter, sendToDiscord, sendToPushover, sendToCdn } from './services'
import { startExpress } from './server'

let activePlanes = new Set<string>()


async function getPlanes() {
  const now = `[${new Date().toISOString()}] -`
  const currentPlanes = new Set<string>()

  try {
    const res = await fetch(`https://api.airplanes.live/v2/point/${coords.lat}/${coords.lon}/${radius}`, { signal:timeout() })
    if (!res.ok) {
      console.error('Failed to fetch api.airplanes.live', res.status, res.statusText)
      return
    }
    const { ac:flights }:AirplanesDotLive = await res.json()
    if (!flights.length) return
    

    for (const plane of flights) {
      if ((plane.dbFlags === 1 || isWhitelisted(plane)) && !isBlacklisted(plane)) {
        const category = plane.dbFlags === 1 ? 'Military' : 'Whitelisted'

        currentPlanes.add(plane.hex)
        if (await recentlySeen(plane)) continue

        if (!activePlanes.has(plane.hex)) {
          console.log(`${now} ${category} plane spotted.`)
          const seenInfo = await getSeenInfo(plane)
          const [ adsbdb, thumb ] = await Promise.all([ getADSBDB(plane), getPlanespotter(plane) ])
          const ctx:PlaneContext = { plane, category, adsbdb, thumb, seenInfo }

          logKV('Operator', plane.ownOp ?? adsbdb?.operator)
          logKV('Callsign', plane.flight)
          logKV('Registration', plane.r)
          logKV('Altitude', plane.alt_baro, 'ft')
          // logKV('Lat Lon', `${plane.lat} ${plane.lon}`)
          // logKV('Speed', plane.gs, 'kts')
          // logKV('Direction', plane.track, '°')
          logKV('Type', plane.desc)
          logKV('Country', adsbdb?.country)
          logKV('Seen before', `${seenInfo.seenCount} times`)

          await Promise.allSettled([ sendToDiscord(ctx), sendToPushover(ctx) ])
          await updateSeen(ctx)
          await sendToCdn()
          console.log('===============')
        }
      }
    }
  } catch (error) { console.error('jetspotter failed:', error)
  } finally { activePlanes = currentPlanes }
}


console.log('Script started. Watching for matching aircraft.')
setInterval(getPlanes, secs)
getPlanes()
startExpress()