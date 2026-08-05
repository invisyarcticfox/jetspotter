export function consLog(label:string, value:any, unit?:string) {
  console.log(' '.repeat(2), `${label}:`, value ? value + (unit ?? '') : 'N/A')
}