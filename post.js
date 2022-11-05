// usage:
// > AWS_REGION=eu-west-1 BUCKET_NAME=your-bucket-name OBJECT_KEY=your-key-name node post.js

import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const { BUCKET_NAME, OBJECT_KEY } = process.env
const s3Client = new S3Client()

const { url, fields } = await createPresignedPost(s3Client, {
  Bucket: BUCKET_NAME,
  Key: OBJECT_KEY,
  Conditions: [
    ['content-length-range', 0, 500 * 1024] // 500 KB max
    // ['starts-with', '$Content-Type', 'image/'] // only images
  ],
  Expires: 3600
})

console.log({ url, fields })

// TODO: double check that this is correct (it seems to only upload the file partially)
console.log(`
  curl -v "${url}" \\
    ${Object.entries(fields).map(([key, value]) => `--form ${key}=${value}`).join(' \\ \n    ')} \\
    -F file=@<PATH_TO_FILE>
`)
