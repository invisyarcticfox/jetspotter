import fs from 'fs'
import path from 'path'

const listsFile = path.join(process.cwd(), 'config', 'lists.json')

type List = { hex?:string[], callsign:string[], registration?:string[], type?:string[] }
type WhiteBlackList = { whitelist?:List, blacklist?:List }
type ListSets = { hex:Set<string>, callsign:Set<string>, registration:Set<string>, type:Set<string> }
export type LoadedLists = { whitelist:ListSets, blacklist:ListSets }

const emptyList = ():ListSets => ({ hex: new Set(), callsign: new Set(), registration: new Set(), type: new Set() })
const toSet = (values?:string[]) => new Set(values?.map(value => value.trim().toUpperCase()) ?? [])

let lists:LoadedLists = { whitelist: emptyList(), blacklist: emptyList() }


function loadLists() {
  if (!fs.existsSync(listsFile)) return lists = { whitelist: emptyList(), blacklist: emptyList() }

  try {
    const user:WhiteBlackList = JSON.parse(fs.readFileSync(listsFile, 'utf8'))

    lists = {
      whitelist: {
        hex: toSet(user.whitelist?.hex),
        callsign: toSet(user.whitelist?.callsign),
        registration: toSet(user.whitelist?.registration),
        type: toSet(user.whitelist?.type)
      },
      blacklist: {
        hex: toSet(user.blacklist?.hex),
        callsign: toSet(user.blacklist?.callsign),
        registration: toSet(user.blacklist?.registration),
        type: toSet(user.blacklist?.type)
      }
    }

    console.log('Lists reloaded')
  } catch (error) { console.error('Failed to load lists.json:', error) }
}
loadLists()

let reloadTimer:NodeJS.Timeout
fs.watch(listsFile, event => {
  if (event === 'change') {
    clearTimeout(reloadTimer)
    reloadTimer = setTimeout(loadLists, 100)
  }
})

export function getLists():LoadedLists { return lists }