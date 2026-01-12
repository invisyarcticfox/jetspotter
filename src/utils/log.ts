export function logKV(label:string, value:string|number|unknown, unit?:string) {
  const val = value ? `${value}${unit ?? ''}` : 'N/A'
  console.log(' '.repeat(3) + `${label}: ${val}`)
}

export function logMsg(msg:string, type:'log'|'warn'='log') {
  if (type==='log') console.log(' '.repeat(3) + msg)
  if (type==='warn') console.warn(' '.repeat(2) + msg)
}