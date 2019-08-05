// This code uses:
//
// * babel-polyfill (https://babeljs.io/docs/usage/polyfill/)
// * whatwg-fetch (https://github.github.io/fetch/)
// * uppy (https://uppy.io)

function singleFileUpload(fileInput) {
  var imagePreview = document.getElementById(fileInput.dataset.previewElement)
  var formGroup    = fileInput.parentNode

  formGroup.removeChild(fileInput)

  var uppy = fileUpload(fileInput)

  uppy
    .use(Uppy.FileInput, {
      target: formGroup,
      locale: { strings: { chooseFiles: 'Choose file' } },
    })
    .use(Uppy.Informer, {
      target: formGroup,
    })
    .use(Uppy.ProgressBar, {
      target: imagePreview.parentNode,
    })
    .use(Uppy.ThumbnailGenerator, {
      thumbnailWidth: 600,
    })

  uppy.on('upload-success', function (file, response) {
    var uploadedFileData = window.uploadedFileData(file, response, fileInput)

    // set hidden field value to the uploaded file data so that it's submitted with the form as the attachment
    var hiddenInput = document.getElementById(fileInput.dataset.uploadResultElement)
    hiddenInput.value = uploadedFileData
  })

  uppy.on('thumbnail:generated', function (file, preview) {
    imagePreview.src = preview
  })
}

function multipleFileUpload(fileInput) {
  var formGroup = fileInput.parentNode

  var uppy = fileUpload(fileInput)

  uppy
    .use(Uppy.Dashboard, {
      target: formGroup,
      inline: true,
      height: 300,
      replaceTargetContent: true,
    })

  uppy.on('upload-success', function (file, response) {
    hiddenField = document.createElement('input')
    hiddenField.type = 'hidden'
    hiddenField.name = 'album[photos_attributes]['+ Math.random().toString(36).substr(2, 9) + '][image]'
    hiddenField.value = window.uploadedFileData(file, response, fileInput)

    document.querySelector('form').appendChild(hiddenField)
  })
}

function fileUpload(fileInput) {
  var uppy = Uppy.Core({
      id: fileInput.id,
      autoProceed: true,
      restrictions: {
        allowedFileTypes: fileInput.accept.split(','),
      },
    })

  if (fileInput.dataset.uploadServer == 's3') {
    uppy.use(Uppy.AwsS3, {
      companionUrl: '/', // will call Shrine's presign endpoint mounted on `/s3/params`
    })
  } else if (fileInput.dataset.uploadServer == 's3_multipart') {
    uppy.use(Uppy.AwsS3Multipart, {
      companionUrl: "/" // will call uppy-s3_multipart endpoint mounted on `/s3/params`
    })
  } else {
    uppy.use(Uppy.XHRUpload, {
      endpoint: '/upload', // Shrine's upload endpoint
    })
  }

  return uppy
}

function uploadedFileData(file, response, fileInput) {
  if (fileInput.dataset.uploadServer == 's3' ||
      fileInput.dataset.uploadServer == 's3_multipart' ) {

    // construct uploaded file data in the format that Shrine expects

    var id;
    if (fileInput.dataset.uploadServer == 's3') {
      id = file.meta['key'].match(/^cache\/(.+)/)[1]; // object key without prefix
    } else {
      // s3_multipart
      // object key without prefix:
      id = (new URL(response.uploadURL)).pathname.match(/^\/cache\/([^\?]+)/)[1];
    }


    return JSON.stringify({
      id: id,
      storage: 'cache',
      metadata: {
        size:      file.size,
        filename:  file.name,
        mime_type: file.type,
      }
    })
  } else {
    return JSON.stringify(response.body)
  }
}

document.querySelectorAll('input[type=file]').forEach(function (fileInput) {
  if (fileInput.multiple) {
    multipleFileUpload(fileInput)
  } else {
    singleFileUpload(fileInput)
  }
})
