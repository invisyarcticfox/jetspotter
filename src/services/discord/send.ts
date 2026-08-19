import { BaseMessageOptions, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, time, TimestampStyles } from 'discord.js'
import type { CTX } from '~/types'
import { getAltColour, formatAltitude, formatCoords, formatHeadingDir } from '~/utils'
import { getOwm } from '..'
import { jetspotterChannel } from '.'
import pkg from '../../../package.json'

const btnIcns = {
  adsbexchange: '1452673789069627552',
  flightradar24: '1452673884662009978',
  planespotters: '1452673905453043857',
  jetphotos: '1452673921097793607'
}

function seen(count:number, seen:string):string {
  const num = `${count} time${count === 1 ? '' : 's'}`
  const rel = time(new Date(seen), TimestampStyles.RelativeTime)
  return `${num} (${rel})`
}


export async function sendToDiscord({plane, thumb, db, category}:CTX) {
  try {
    const weather = await getOwm()
    const lnkBtns = [
      {
        row: 1,
        label: 'ADSBExchange',
        emoji: btnIcns.adsbexchange,
        url: `https://globe.adsbexchange.com/?icao=${plane.hex}`,
        disabled: false,
      },
      {
        row: 1,
        label: 'FlightRadar24',
        emoji: btnIcns.flightradar24,
        url: plane.callsign ? `https://flightradar24.com/${plane.callsign}` : 'https://flightradar24.com',
        disabled: !plane.callsign,
      },
      {
        row: 2,
        label: 'PlaneSpotters',
        emoji: btnIcns.planespotters,
        url: plane.reg ? `https://planespotters.net/photos/reg/${plane.reg}` : 'https://planespotters.net',
        disabled: !(thumb && plane.reg),
      },
      {
        row: 2,
        label: 'JetPhotos',
        emoji: btnIcns.jetphotos,
        url: plane.reg ? `https://www.jetphotos.com/registration/${plane.reg}` : 'https://www.jetphotos.com',
        disabled: !(thumb && plane.reg),
      },
    ]
    
    const payload:BaseMessageOptions = {
      content: `${category} Aircraft Spotted!`,
      embeds: [new EmbedBuilder()
        .setColor(getAltColour(plane.alt))
        .setFields([
          { name: 'Operator', value: plane.operator ?? 'N/A' },
          { name: 'Callsign', value: plane.callsign ?? 'N/A' },
          { name: 'Registration', value: plane.reg ?? 'N/A' },
          { name: 'Type', value: plane.type ?? 'N/A' },
          { name: 'Speed', value: plane.gs ? `${plane.gs.toFixed(0)}kts` : 'N/A' },
          { name: 'Altitude', value: formatAltitude(plane) },
          { name: 'Lat Lon', value: formatCoords(plane) },
          { name: 'Heading', value: formatHeadingDir(plane.heading) },
          { name: 'Source', value: plane.source ?? 'N/A' },
          { name: 'Seen Before?', value: db?.seenCount ? seen(db.seenCount, db.lastSeen) : 'No' },
          { name: 'Photographed?', value: db?.photographed ? 'Yes' : 'No' },
          { name: 'Cloud Coverage', value: weather ? `${weather?.clouds.percent}%`: 'N/A' }
        ].map(f => ({ ...f, inline:true })))
        .setImage(thumb ? thumb.photo : null)
        .setFooter({
          text: thumb ? `Version ${pkg.version} | Photo by ${thumb.photographer}` : `Version ${pkg.version}`,
          iconURL: 'https://cdn.discordapp.com/emojis/1474124439644934164'
        })
      ],
      components: Object.values(Object.groupBy(lnkBtns, btn => btn.row)).map(btns =>
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            btns!.map(btn =>
              new ButtonBuilder()
                .setLabel(`View on ${btn.label}`)
                .setStyle(ButtonStyle.Link)
                .setEmoji(btn.emoji)
                .setURL(btn.url)
                .setDisabled(btn.disabled)
            )
          )
      )
    }

    await jetspotterChannel.send(payload)
    console.log('Sent Discord message')
  } catch (error) { console.error('DISCORD ERROR:', error) }
}