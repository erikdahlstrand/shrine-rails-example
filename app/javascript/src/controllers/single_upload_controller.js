import { Controller } from 'stimulus'
import { FileInput, Informer, ProgressBar, ThumbnailGenerator } from 'uppy'
import { uppyInstance, uploadedFileData } from '../uppy'

export default class extends Controller {
  static targets = [ 'input', 'result', 'preview' ]
  static values = { types: Array, server: String }

  connect() {
    this.inputTarget.classList.add('d-none')

    this.uppy = this.createUppy()
  }

  disconnect() {
    this.uppy.close()
  }

  createUppy() {
    const uppy = uppyInstance({
        id: this.inputTarget.id,
        types: this.typesValue,
        server: this.serverValue,
      })
      .use(FileInput, {
        target: this.inputTarget.parentNode,
        locale: { strings: { chooseFiles: 'Choose file' } },
      })
      .use(Informer, {
        target: this.inputTarget.parentNode,
      })
      .use(ProgressBar, {
        target: this.previewTarget.parentNode,
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
