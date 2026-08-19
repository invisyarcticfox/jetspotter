export function timeout(secs:number=5):AbortSignal {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), secs * 1000)
  return controller.signal
}