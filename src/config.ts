export const env = {
  coords: { lat: process.env.COORD_LAT!, lon: process.env.COORD_LON! },
  api: {
    pushover: {
      user: process.env.PO_USR_KEY!,
      token: process.env.PO_TOKEN!
    },
    cloudflare: {
      accId: process.env.CF_ACC_ID!,
      d1: {
        id: process.env.CF_D1_ID!,
        token: process.env.CF_D1_TOKEN!
      }
    },
    owm: { token: process.env.OWM_TOKEN! }
  }
}

export const conf = {
  radius: 15, // nmi
  interval: 30, //seconds
  tz: 'Europe/London' // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timezone
}