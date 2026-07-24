import 'dotenv/config'
import { type AirplanesDotLive, DbFlags } from './types/http'
import { env, conf } from './config'
import { timeout } from './utils/http'
import { consLog } from './utils/log'


async function getPlanes() {
  const now = new Date().toLocaleDateString('en-GB', {
    second: '2-digit', minute: '2-digit', hour: '2-digit', hour12: false,
    day: '2-digit', month: 'short', year: 'numeric',
    timeZone: conf.tz
  }).replace(',', '')

  try {
    const res = await fetch(`https://api.airplanes.live/v2/point/${env.coords.lat}/${env.coords.lon}/${conf.radius}`, { signal: timeout() })
    if (!res.ok) return console.log(`Failed to fetch ${res.url}:`, res.status, res.statusText)
    const { ac:flights }:AirplanesDotLive = await res.json()
    if (!flights) return
    
    for (const plane of flights) {
      const isMil = (plane.dbFlags ?? 0 & DbFlags.Military) !== 0
      if (isMil) {
        console.group(`[${now}] - Plane Spotted!`)
        consLog('Hex', plane.hex)
        consLog('Callsign', plane.flight?.trim())
        consLog('Registration', plane.r)
        consLog('Type', plane.desc)
        consLog('Type Code', plane.t)
        consLog('Operator', plane.ownOp)
        consLog('Ground Speed', plane.gs, 'kts')
        consLog('Altitude', plane.alt_baro, 'ft')
        consLog('Heading', plane.track, '°'),
        consLog('Lat Lon', `${plane.lat} ${plane.lon}`)
        console.groupEnd()
        console.log('='.repeat(20))
      }
    }
  } catch (error) { console.error(error) }
}


(async () => {
  console.log('Script started.')

  getPlanes()
  setInterval(getPlanes, conf.interval * 1000)
})().catch(error => console.error(error))