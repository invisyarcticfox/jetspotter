import { config } from '~/config'
import type { OpenWeatherMap, Weather } from '~/types'
import { timeout } from '~/utils'


export async function getOwm():Promise<Weather|null> {
  try {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather?units=metric')
    url.searchParams.set('lat', config.coords.lat)
    url.searchParams.set('lon', config.coords.lon)
    url.searchParams.set('appid', config.owm.apiKey)

    const res = await fetch(url, { signal: timeout() })
    if (!res.ok) {
      console.error(`Failed to fetch ${res.url}:`, res.status, res.statusText)
      return null
    }

    const d:OpenWeatherMap = await res.json()
    return {
      weather: { main: d.weather[0].main, desc: d.weather[0].description },
      temp: {
        main: d.main.temp,
        feelsLike: d.main.feels_like,
        min: d.main.temp_min,
        max: d.main.temp_max
      },
      visibility: d.visibility,
      clouds: { percent: d.clouds.all }
    }
  } catch (error) {
    console.error('OPENWEATHERMAP ERROR:', error)
    return null
  }
}