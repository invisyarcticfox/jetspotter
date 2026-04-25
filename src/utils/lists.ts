import fs from 'fs'
import path from 'path'
import type { Lists } from '~/types'

const listsFile = path.join(process.cwd(), 'src', 'lists.json')


function loadLists():Lists {
  if (!fs.existsSync(listsFile)) {
    return {
      whitelist: { desc: [], reg: [] },
      blacklist: { desc: [], reg: [] }
    }
  }

  const content = fs.readFileSync(listsFile, 'utf-8')
  return JSON.parse(content)
}

export const { whitelist, blacklist } = loadLists()