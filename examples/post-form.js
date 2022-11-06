// usage:
// > AWS_REGION=eu-west-1 BUCKET_NAME=your-bucket-name OBJECT_KEY=your-key-name node post-form.js
//
// it will start a local web server on an open port

import { createServer } from 'node:http'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const { BUCKET_NAME, OBJECT_KEY } = process.env
const s3Client = new S3Client()

function generatePage (htmlContent) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Upload file</title>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `
}

const server = createServer(async (req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost')
  if (req.method === 'GET' && reqUrl.pathname === '/') {
    // generate the presigned url for upload and render the form
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: BUCKET_NAME,
      Key: OBJECT_KEY,
      Conditions: [
        ['content-length-range', 0, 5 * 1024 * 1024], // 5 MB max
        ['eq', '$Content-Type', 'image/png'] // only pngs
        // complete set of possible conditions: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
      ],
      Fields: {
        'Content-Type': 'image/png', // defines the accepted content types
        success_action_redirect: `http://localhost:${server.address().port}/success`
        // complete list of fields: https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPOST.html
      },
      Expires: 3600
    })

    const code = `<h1>Upload an image to S3</h1>
    <form action="${url}" method="post" enctype="multipart/form-data">
      ${Object.entries(fields).map(([key, value]) => `<input type="hidden" name="${key}" value="${value.replace(/"/g, '&quot;')}">`).join('\n')}
      <div><input type="file" name="file" accept="image/png"></div>
      <div><input type="submit" value="Upload"></div>
    </form>`

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(generatePage(code))
  } else if (req.method === 'GET' && reqUrl.pathname === '/success') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(generatePage('Upload successful!'))
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(generatePage('Not found'))
  }
})

server.listen(0, () => {
  console.log(`Server started at http://localhost:${server.address().port}`)
})
