import type { DiscordButtons, PlaneContext, EmbedField, EmbedData } from '~/types'
import { formatAltitude, getAltColour, formatTrackDir, logMsg, timeout, formatSeenCount, formatCoords } from '~/utils'
import { coords } from '~/config'
import { getWeather } from '.'
import pkg from '../../package.json'


export async function sendToDiscord({plane, category, adsbdb, thumb, seenInfo}:PlaneContext) {
  const seen = formatSeenCount(seenInfo)
  const weather = await getWeather()

  const fields:EmbedField[] = [
    { name: 'Operator', value: plane.ownOp ?? adsbdb?.operator ?? 'N/A' },
    { name: 'Callsign', value: `${plane.flight?.trim() || 'N/A'}` },
    { name: 'Registration', value: `${plane.r?.trim() || 'N/A'}` },
    { name: 'Type', value: plane.desc ?? 'N/A' },
    { name: 'Speed', value: plane.gs ? `${plane.gs}kts` : 'N/A' },
    { name: 'Altitude', value: formatAltitude(plane) },
    { name: 'Lat Lon', value: formatCoords(coords, plane) },
    { name: 'Bearing', value: formatTrackDir(plane) },
    { name: 'Source', value: plane.type.toUpperCase() ?? 'N/A' },
    { name: 'Seen Before?', value: seen ? seen : 'No' },
    { name: 'Photographed?', value: seenInfo.photographed ? 'Yes' : 'No' },
    { name: 'Cloud Coverage', value: weather ? `${weather?.clouds.percent}%` : 'N/A' },
  ].map(f => ({ ...f, inline:true }) )
  
  const embed:EmbedData = {
    color: getAltColour(plane),
    fields,
    image: thumb ? { url: thumb.thumbnail.large } : undefined,
    footer: {
      iconURL: 'https://cdn.discordapp.com/emojis/1474124439644934164',
      text: `Version ${pkg.version}` + thumb ? ` - Photo by ${thumb?.photographer}` : ''
    }
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