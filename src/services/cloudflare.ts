import fs from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { cfAccountId, cfAccessKey, cfSecretAccessKey, seenFile } from '../config'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${cfAccountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: cfAccessKey as string, secretAccessKey: cfSecretAccessKey as string }
})

const bucket = 'api'


export async function sendToR2() {
  try {
    const file = fs.readFileSync(seenFile)

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: 'planes.json',
        Body: file,
        ContentType: 'application/json'
      })
    )
    
    console.log(`   Uploaded JSON file to R2 Bucket!`)
  } catch (error) {
    console.error(error)
  }
}