import fs from 'node:fs'
import path from 'node:path'
import { defaultConf, type Config } from './defaults'
import type { WhiteBlackList, LoadedLists } from './types'

const configFile = path.join(process.cwd(), 'config', 'config.json')
const listsFile = path.join(process.cwd(), 'config', 'lists.json')


const userConf:Partial<Config> = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile, 'utf8')) : {} 
export const config:Config = { ...defaultConf, ...userConf }


let lists:LoadedLists = {
  whitelist: { registration:new Set(), type:new Set() },
  blacklist: { registration:new Set(), type:new Set() }
}

function loadLists() {
  if (!fs.existsSync(listsFile)) {
    return lists = {
      whitelist: { registration: new Set(), type: new Set() },
      blacklist: { registration: new Set(), type: new Set() }
    }
  }

  try {
    const user:Partial<WhiteBlackList> = JSON.parse(fs.readFileSync(listsFile, 'utf8'))

    lists = {
      whitelist: {
        registration: new Set(user.whitelist?.registration?.map(r => r.trim().toUpperCase()) ?? []),
        type: new Set(user.whitelist?.type?.map(t => t.trim().toUpperCase()) ?? [])
      },
      blacklist: {
        registration: new Set(user.blacklist?.registration?.map(r => r.trim().toUpperCase()) ?? []),
        type: new Set(user.blacklist?.type?.map(t => t.trim().toUpperCase()) ?? [])
      }
    }

    console.log('Lists reloaded')
  } catch (error) { console.error('Failed to load lists.json:', error) }
}
loadLists()

fs.watch(listsFile, (event) => { if (event === 'change') loadLists() })
export function getLists() { return lists }