export * from './location'
export * from './seen'
export * from './log'


export function sleep(ms:number):Promise<void> { return new Promise(resolve => setTimeout(resolve,ms)) }

export function timeout(ms:number=5000):AbortSignal {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}