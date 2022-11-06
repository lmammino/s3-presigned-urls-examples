// usage:
// > AWS_REGION=eu-west-1 BUCKET_NAME=your-bucket-name node post-form-ajax.js
//
// it will start a local web server on an open port
//
// The bucket requires CORS configuration to allow the browser to access the bucket.
//
// You can use the following CORS:
//
// [
//   {
//       "AllowedHeaders": [
//           "*"
//       ],
//       "AllowedMethods": [
//           "GET",
//           "HEAD",
//           "PUT",
//           "POST",
//           "DELETE"
//       ],
//       "AllowedOrigins": [
//           "*"
//       ],
//       "ExposeHeaders": [
//           "x-amz-server-side-encryption",
//           "x-amz-request-id",
//           "x-amz-id-2",
//           "ETag"
//       ],
//       "MaxAgeSeconds": 3000
//   }
// ]

import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const { BUCKET_NAME } = process.env
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
      Key: randomUUID(), // gets a random uuid every time
      Conditions: [
        ['content-length-range', 0, 5 * 1024 * 1024], // 5 MB max
        ['starts-with', '$Content-Type', 'image/'],
        ['starts-with', '$Content-Disposition', 'attachment;'] // only images
        // complete set of possible conditions: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
      ],
      Fields: {
        success_action_status: '201'
        // complete list of fields: https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPOST.html
      },
      Expires: 3600
    })

    const code = `<h1>Upload an image to S3</h1>
    <form action="${url}" method="post" enctype="multipart/form-data">
      ${Object.entries(fields).map(([key, value]) => `<input type="hidden" name="${key}" value="${value.replace(/"/g, '&quot;')}">`).join('\n')}
      <!-- the following 2 fields will be populated by JS, they need to be present in the form before the file input -->
      <input name="Content-Type" type="hidden" value="">
      <input name="Content-Disposition" type="hidden" value="">
      <div><input type="file" name="file" accept="image/*"></div>
      <div><input type="submit" value="Upload"></div>
    </form>
    <div id="result"></div>
    <script>
      const result = document.getElementById('result')
      const file = document.querySelector('input[type="file"]')
      document.querySelector('form').addEventListener('submit', async function (e) {
        e.preventDefault()
        const selectedFile = file.files[0]
        if (!selectedFile) {
          result.innerHTML = 'No file selected'
          return
        }
        const contentType = selectedFile.type
        const filename = selectedFile.name
        const formData = new FormData(this)
        formData.set('Content-Disposition', \`attachment; filename="\${filename}"\`)
        formData.set('Content-Type', contentType)
        result.innerText = 'Uploading...'
        this.inert = true
        const response = await fetch(this.action, {
          method: this.method,
          headers: {
            accept: 'application/json'
          },
          body: formData
        })
        console.log(response)
        const responseText = await response.text()
        console.log(responseText)
        result.innerText = \`Response code: \${response.status} - Response body: \${responseText}\`
        this.inert = false
      })
    </script>
    `

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
