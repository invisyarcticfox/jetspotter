import 'dotenv/config'
import { AdsbLol, type CTX, DbFlags } from './types'
import { config, getLists } from '~/config'
import { timeout, consLog } from '~/utils'
import { getAdsbDb, getPlanespotters, sendToDiscord, sendToPushover, getAirplanesLive } from '~/services'
import { login as discordLogin } from '~/services/discord'
import { getDb, updateDb, seenRecently } from '~/db/funcs'

const inRangePlanes = new Set<string>()

function getCategory(plane:AdsbLol.ReApi['aircraft'][number]):CTX['category']|null {
  const lists = getLists()

  const hex = plane.hex?.trim().toUpperCase() ?? ''
  const callsign = plane.flight?.trim().toUpperCase() || ''
  const reg = plane.r?.trim().toUpperCase() ?? ''
  const type = plane.t?.trim().toUpperCase() ?? ''

  const isBlacklisted =
    lists.blacklist.hex.has(hex) ||
    lists.blacklist.callsign.has(callsign) ||
    lists.blacklist.registration.has(reg) ||
    lists.blacklist.type.has(type)
  if (isBlacklisted) return null

  const isMilitary = ((plane.dbFlags ?? 0) & DbFlags.Military) !== 0
  if (isMilitary) return 'Military'

  const isWhitelisted =
    lists.whitelist.hex.has(hex) ||
    lists.whitelist.callsign.has(callsign) ||
    lists.whitelist.registration.has(reg) ||
    lists.whitelist.type.has(type)
  if (isWhitelisted) return 'Whitelisted'

  return null
}


async function getPlanes() {
  const now = new Date().toLocaleDateString('en-GB', {
    second: '2-digit', minute: '2-digit', hour: '2-digit', hour12: false,
    day: '2-digit', month: 'short', year: 'numeric'
  }).replace(',', '')

  try {
    const res = await fetch(
      `https://re-api.adsb.lol/?circle=${config.coords.lat},${config.coords.lon},${config.radius}`,
      {
        signal: timeout(10),
        headers: { 'User-Agent': config.userAgent }
      })
    if (!res.ok) return console.log(`Failed to fetch ${res.url}:`, res.status, res.statusText)
    const { aircraft }:AdsbLol.ReApi = await res.json()
    if (!aircraft.length) return inRangePlanes.clear()

    const currentPlanes = new Set<string>()

    for (const plane of aircraft) {
      const category = getCategory(plane)
      if (!category) continue

      currentPlanes.add(plane.hex)

      if (inRangePlanes.has(plane.hex)) continue
      if (seenRecently(plane.hex)) continue
      
      console.log(`[${now}] - ${category} Plane Spotted!`)
      const db = getDb(plane.hex)
      const [ apl, adsbdb, thumb ] = await Promise.all([ getAirplanesLive(plane.hex), getAdsbDb(plane.hex), getPlanespotters(plane) ])

      const aircraft:CTX = {
        plane: {
          hex: db?.hex ?? plane.hex ?? apl?.hex ?? adsbdb?.mode_s,
          reg: db?.reg ?? plane.r ?? apl?.r ?? adsbdb?.registration,
          callsign: plane.flight?.trim() || apl?.flight?.trim() || undefined,
          type: db?.type ?? apl?.desc ?? `${adsbdb?.manufacturer} ${adsbdb?.type}`,
          operator: apl?.ownOp ?? adsbdb?.registered_owner ?? db?.operator ?? undefined,
          alt: plane.alt_baro,
          baro_rate: plane.baro_rate,
          geo_rate: plane.geom_rate,
          gs: plane.gs,
          lat: plane.lat,
          lon: plane.lon,
          heading: plane.track,
          source: plane.type.toUpperCase(),
          country: db?.country ?? adsbdb?.registered_owner_country_name
        },
        category,
        thumb: thumb ? { photo: thumb.thumbnail_large.src, photographer: thumb.photographer } : null,
        db: db ? { ...db } : null,
      }
      
      consLog('Hex', aircraft.plane.hex)
      consLog('Callsign', aircraft.plane.callsign)
      consLog('Registration', aircraft.plane.reg)
      consLog('Type', aircraft.plane.type)
      consLog('Operator', aircraft.plane.operator)

      await Promise.all([ sendToDiscord(aircraft), sendToPushover(aircraft) ])
      updateDb(aircraft)
      console.log('='.repeat(25))
    }

    inRangePlanes.clear()
    currentPlanes.forEach(hex => inRangePlanes.add(hex))
  } catch (error) { console.error(error) }
}


(async () => {
  await discordLogin()
  console.log('Script started. Waiting for matching aircraft..')

  await getPlanes()
  setInterval(getPlanes, 30 * 1000)
})().catch(error => console.error(error))