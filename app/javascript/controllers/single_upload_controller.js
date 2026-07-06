import { Controller } from '@hotwired/stimulus'
import { StatusBar, ThumbnailGenerator } from 'uppy'
import { uppyInstance, uploadedFileData } from 'uppy_helper'

export default class extends Controller {
  static targets = [ 'input', 'result', 'preview' ]
  static values = { types: Array, server: String }

  connect() {
    this.uppy = this.createUppy()
  }

  disconnect() {
    this.uppy.destroy()
  }

  // Uppy 5 removed the FileInput plugin, so we keep the native file input
  // (wired up via a Stimulus action) and hand its files to Uppy ourselves.
  upload(event) {
    Array.from(event.target.files).forEach((file) => {
      try {
        this.uppy.addFile(file)
      } catch (error) {
        if (!error.isRestriction) throw error // ignore `allowedFileTypes` rejections
      }
    })
    event.target.value = null // allow selecting the same file again
  }

  createUppy() {
    const uppy = uppyInstance({
        id: this.inputTarget.id,
        types: this.typesValue,
        server: this.serverValue,
      })
      .use(StatusBar, {
        target: this.previewTarget.parentNode,
        hideUploadButton: true,
      })
      .use(ThumbnailGenerator, {
        thumbnailWidth: 600,
      })

    uppy.on('upload-success', (file, response) => {
      // set hidden field value to the uploaded file data so that it's submitted with the form as the attachment
      this.resultTarget.value = uploadedFileData(file, response, this.serverValue)
    })

    uppy.on('thumbnail:generated', (file, preview) => {
      this.previewTarget.src = preview
    })

    return uppy
  }
}
