import express from 'express'
import { routes } from './routes'


export function startExpress() {
  const app = express()
  app.use(express.json())
  app.use(express.text())

  app.use('/', routes)
  app.listen(9004, () => { console.log('Express server running on http://raspi:9004/') })
}