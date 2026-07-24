export function consLog(label:string, value:any, unit?:string) {
  console.log(`${label}:`, value ? value + (unit ?? '') : 'N/A')
}