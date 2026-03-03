import { OpenWeatherMap, WeatherContext } from '~/types'
import { coords, env } from '~/config'
import { timeout } from '~/utils'


export async function getWeather():Promise<WeatherContext|null> {
  try {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather?units=metric')
    url.searchParams.set('lat', coords.lat)
    url.searchParams.set('lon', coords.lon)
    url.searchParams.set('appid', env.owm.appid)
    const res = await fetch(url, { signal:timeout() })
    const d:OpenWeatherMap = await res.json()

    return {
      weather: { main: d.weather[0].main, desc: d.weather[0].description, },
      temp: {
        main: d.main.temp,
        feelsLike: d.main.feels_like,
        min: d.main.temp_min,
        max: d.main.temp_max
      },
      visibility: d.visibility,
      wind: { speed: d.wind.speed, deg: d.wind.deg },
      clouds: { percent: d.clouds.all }
    }
  } catch (error) { console.error(error); return null }
}