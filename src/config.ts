import fs from 'fs'
import path from 'path'
export { getLists } from './whiteblacklist'

const confFile = path.join(process.cwd(), 'config', 'config.json')
type Config = {
  coords: { lat: number, lon: number }
  radius: number
  userAgent: string

  discord: {
    bot: { token: string }
    channelId: string
  }
  owm: { apiKey: string }
  pushover: { user: string, token: string }
}

const usrConf:Config = JSON.parse(fs.readFileSync(confFile, 'utf8'))
export const config:Config = usrConf