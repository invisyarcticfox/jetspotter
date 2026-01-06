import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../config'
import { loadSeen, logMsg } from '../utils'

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.cloudflare.accountId}.r2.cloudflarestorage.com`,
  credentials: { ...env.cloudflare }
})


export async function sendToCdn() {
  try {
    const data = await loadSeen()
    await client.send(
      new PutObjectCommand({
        Bucket: 'cdn',
        Key: 'seen.json',
        Body: JSON.stringify(data),
        CacheControl: 'no-cache',
        ContentType: 'application/json'
      })
    )
    logMsg('Uploaded seen.json to Cloudflare.')
  } catch (error) { console.error('Failed to upload to Cloudflare:', error) }
}