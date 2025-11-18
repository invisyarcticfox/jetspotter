import { bsHeartbeatUrl } from '../config'


export async function betterstackHeartbeat(status:'ok'|'fail'='ok') {
  const url = `${bsHeartbeatUrl as string}${status === 'ok' ? '' : '/fail'}`
  try {
    const res = await fetch(url)
    if (status === 'fail') {
      if (res.ok) { console.log('\'Fail\' heartbeat sent')
      } else console.error('\'Fail\' heartbeat not sent:', res.status, res.statusText)
    } else { if (!res.ok) console.error('\'ok\' heartbeat failed', res.status, res.statusText) }
  } catch (error) { console.error('CRIT heartbeat error:', error) } 
}