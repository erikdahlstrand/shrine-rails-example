import { Uppy, XHRUpload, AwsS3 } from 'uppy'

export function uppyInstance({ id, types, server }) {
  const uppy = new Uppy({
    id: id,
    autoProceed: true,
    restrictions: {
      allowedFileTypes: types,
    },
  })

  if (server == 's3') {
    // The AwsS3 and AwsS3Multipart plugins were merged in Uppy 4, and the
    // `companionUrl` option was renamed to `endpoint`. Uppy's built-in Companion
    // client fetches the upload parameters from `<endpoint>/s3/params`, which is
    // where Shrine's presign endpoint is mounted.
    uppy.use(AwsS3, {
      endpoint: '/',
      shouldUseMultipart: false, // Shrine's presign endpoint only signs single-request uploads
    })
  } else if (server == 's3_multipart') {
    // In multipart mode AwsS3 talks to `<endpoint>/s3/multipart`, which is where
    // the uppy-s3_multipart endpoint is mounted.
    uppy.use(AwsS3, {
      endpoint: '/',
      shouldUseMultipart: true,
    })
  } else {
    uppy.use(XHRUpload, {
      endpoint: '/upload', // Shrine's upload endpoint
    })
  }

  return uppy
}

export function uploadedFileData(file, response, server) {
  if (server == 's3' || server == 's3_multipart') {
    // Uppy stores the presigned S3 object key on `file.s3Multipart.key`
    const id = file.s3Multipart.key.match(/^cache\/(.+)/)[1] // object key without prefix

    return JSON.stringify(fileData(file, id))
  } else {
    return JSON.stringify(response.body)
  }
}

// constructs uploaded file data in the format that Shrine expects
function fileData(file, id) {
  return {
    id: id,
    storage: 'cache',
    metadata: {
      size:      file.size,
      filename:  file.name,
      mime_type: file.type,
    }
  }
}
