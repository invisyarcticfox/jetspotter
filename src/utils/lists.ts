import fs from 'fs'
import path from 'path'


const listsFile = path.join(process.cwd(), 'lists.txt')

function loadLists() {
  if (!fs.existsSync(listsFile)) return { whitelist: [], blacklist: [] }

  const content = fs.readFileSync(listsFile, 'utf-8')
  const result: { whitelist: string[]; blacklist: string[] } = { whitelist: [], blacklist: [] }

  content.split('\n').forEach(line => {
    const [key, value] = line.split(':')
    if (!key || !value) return

    const items = value
      .split(',')
      .map(v => v.trim().toLowerCase())
      .filter(Boolean)

    if (key.trim().toLowerCase() === 'whitelist') result.whitelist = items
    if (key.trim().toLowerCase() === 'blacklist') result.blacklist = items
  })

  return result
}

export const { whitelist, blacklist } = loadLists()