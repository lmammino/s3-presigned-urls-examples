# s3-presigned-urls-examples

Code examples on how to generate and use S3 pre-signed URLs using the JavaScript SDK v3.

These examples are being used in the following resources (which are highly recommended to fully appreciate the topic):

- My article on S3 pre-signed URLs: [The illustrated guide to S3 pre-signed URLs](https://fourtheorem.com/the-illustrated-guide-to-s3-pre-signed-urls/)
- My talk at the AWS Dublin User Group: [Everything I know about S3 pre-signed URLs](https://fth.link/presign)


## Examples

The [`examples`](/examples) folder contains several examples of how to generate S3 pre-signed URLs for some of the most common use cases.


### Get a file from a bucket

[`/examples/get.js`](/examples/get.js)

Showcases how to create a pre-signed URL that can be used to give temporary access to a private file stored in an S3 bucket.


### Upload a file to a bucket using the PUT method

[`/examples/put.js`](/examples/put.js)

Showcases how to create a pre-signed URL that can be used to upload an object into an S3 bucket using the PUT method.


### Upload a file to a bucket using the POST method (with curl)

[`/examples/post.js`](/examples/post.js)

Showcases how to create a pre-signed URL that can be used to upload an object into an S3 bucket using the POST method (using Curl).


### Upload a file to a bucket using the POST method (with a web form)

[`/examples/post-from.js`](/examples/post-from.js)

Showcases how to create a pre-signed URL that can be used to upload an object into an S3 bucket using the POST method (using a web form).


### Upload a file to a bucket using the POST method (using client-side JavaScript a.k.a. AJAX)

[`/examples/post-from-ajax.js`](/examples/post-from-ajax.js)

Showcases how to create a pre-signed URL that can be used to upload an object into an S3 bucket using the POST method (using a web form and client-side JavaScript).


### Listing all buckets

[`/examples/list-buckets.js`](/examples/list-buckets.js)

Showcases how to create a pre-signed URL that can be used to list all the buckets in the signer account.


### Listing objects in a bucket

[`/examples/list-objects.js`](/examples/list-objects.js)

Showcases how to create a pre-signed URL that can be used to list all the objects in a given bucket.


### Deleting an object

[`/examples/delete-object.js`](/examples/delete-object.js)

Showcases how to create a pre-signed URL that can be used to delete a given object from a bucket.


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/s3-presigned-urls-examples/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
