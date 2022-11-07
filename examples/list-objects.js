// usage:
// > AWS_REGION=eu-west-1 BUCKET_NAME=your-bucket-name node list-buckets.js

import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const { BUCKET_NAME } = process.env
const s3Client = new S3Client()

const command = new ListObjectsCommand({
  Bucket: BUCKET_NAME
})

const signedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 3600
})

console.log(`
  curl -v "${signedUrl}"
`)

// this will give you XML, sigh!
