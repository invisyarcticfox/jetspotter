import fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { FlightInfo } from '../types'
import { cfAccountId, cfAccessKey, cfSecretAccessKey } from '../config'
import { updateSeen, seenFile } from '../utils'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${cfAccountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: cfAccessKey as string, secretAccessKey: cfSecretAccessKey as string }
})


export async function sendToR2(flight:FlightInfo) {
  const reg = flight.r || 'N/A'
  const type = flight.desc || 'N/A'
  const operator = flight.ownOp || 'N/A'
  updateSeen(reg,type,operator)
  
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: 'api',
        Key: 'planes.json',
        Body: fs.readFileSync(seenFile),
        ContentType: 'application/json'
      })
    )
    
    console.log(`   Uploaded JSON file to R2 Bucket!`)
  } catch (error) {
    console.error(error)
  }
}