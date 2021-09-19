require("@rails/ujs").start()

import 'bootstrap/dist/css/bootstrap.css'

import { singleFileUpload, multipleFileUpload } from 'fileUpload'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type=file]').forEach(fileInput => {
    if (fileInput.multiple) {
      multipleFileUpload(fileInput)
    } else {
      singleFileUpload(fileInput)
    }
  })
})
