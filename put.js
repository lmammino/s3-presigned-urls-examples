// usage:
// > AWS_REGION=eu-west-1 BUCKET_NAME=your-bucket-name OBJECT_KEY=your-key-name node put.js

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const { BUCKET_NAME, OBJECT_KEY } = process.env
const s3Client = new S3Client()

const command = new PutObjectCommand({
  Bucket: BUCKET_NAME,
  Key: OBJECT_KEY
})

const signedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 3600
})

console.log(signedUrl)
