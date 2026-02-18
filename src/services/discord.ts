import type { DiscordEmbed, DiscordEmbedField, DiscordButtons, PlaneContext } from '~/types'
import { formatAltitude, getAltColour, formatTrackDir, logMsg, timeout, formatSeenCount, formatCoords } from '~/utils'
import { coords } from '~/config'
import pkg from '../../package.json'


export async function sendDiscordMessage({plane, category, adsbdb, thumb, seenInfo}:PlaneContext) {
  const seen = formatSeenCount(seenInfo)
  const fields:DiscordEmbedField[] = [
    { name: 'Operator', value: plane.ownOp ?? adsbdb?.operator ?? 'N/A' },
    { name: 'Callsign', value: `${plane.flight?.trim() || 'N/A'}` },
    { name: 'Registration', value: `${plane.r?.trim() || 'N/A'}` },
    { name: 'Type', value: plane.desc ?? 'N/A' },
    { name: 'Country', value: adsbdb?.country ?? 'N/A' },
    { name: 'Speed', value: plane.gs ? `${plane.gs}kts` : 'N/A' },
    { name: 'Lat Lon', value: formatCoords(coords, plane) },
    { name: 'Altitude', value: formatAltitude(plane) },
    { name: 'Bearing', value: formatTrackDir(plane) },
    { name: 'Seen Before?', value: seen ? seen : 'No' },
    { name: 'Photographed?', value: seenInfo.photographed ? 'Yes' : 'No' },
  ].map(f => ({ ...f, inline:true }) )
  
  const embed:DiscordEmbed = {
    color: getAltColour(plane),
    fields,
    image: thumb ? { url: thumb.thumbnail.large } : null,
    footer: { text: thumb ? `Version ${pkg.version} - Photo by ${thumb.photographer}` : `Version ${pkg.version}` }
  }
  const buttons:DiscordButtons[] = [
    { name: 'ADSBExchange.com', link: `https://globe.adsbexchange.com/?icao=${plane.hex}`, row:1 },
    { name: 'FlightRadar24.com', link: plane.flight?.trim() ? `https://flightradar24.com/${plane.flight.trim()}` : null, row:1 },
    { name: 'Planespotters.net', link: thumb ? thumb.link : null, row:2 },
  ]


  try {
    const res = await fetch('http://raspi:4321/api/discord/jetspotter', {
      signal: timeout(), method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, embed, buttons })
    })
    if (!res.ok) { console.error('Discord POST failed:', res.status, res.statusText)
    } else { logMsg('Sent Discord message.') }
  } catch (error) { console.error('Failed to send discord message:', error) }
}