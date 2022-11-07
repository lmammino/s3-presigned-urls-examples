// usage:
// > AWS_REGION=eu-west-1 node list-buckets.js

import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client()

const command = new ListBucketsCommand({})

const signedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 3600
})

console.log(`
  curl -v "${signedUrl}"
`)

// this will give you XML, sigh!
