import { bsHeartbeatUrl } from '../config'


export async function betterstackHeartbeat() {
  try {
    const res = await fetch(bsHeartbeatUrl as string)
    if (!res.ok) console.error(res.status, res.statusText)
  } catch (error) { console.error(error) } 
}