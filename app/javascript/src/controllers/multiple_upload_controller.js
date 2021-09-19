import { Controller } from 'stimulus'
import { Dashboard } from 'uppy'
import { uppyInstance, uploadedFileData } from '../uppy'
import { nanoid } from 'nanoid'

export default class extends Controller {
  static targets = [ 'input' ]
  static values = { types: Array, server: String }

  connect() {
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
      .use(Dashboard, {
        target: this.inputTarget.parentNode,
        inline: true,
        height: 300,
        replaceTargetContent: true,
      })

    uppy.on('upload-success', (file, response) => {
      const hiddenField = document.createElement('input')

      hiddenField.type = 'hidden'
      hiddenField.name = `album[photos_attributes][${nanoid()}][image]`
      hiddenField.value = uploadedFileData(file, response, this.serverValue)

      this.element.appendChild(hiddenField)
    })

    return uppy
  }
}
