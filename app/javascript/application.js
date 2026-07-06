import { Application } from "@hotwired/stimulus"
import SingleUploadController from "controllers/single_upload_controller"
import MultipleUploadController from "controllers/multiple_upload_controller"

const application = Application.start()
application.register("single-upload", SingleUploadController)
application.register("multiple-upload", MultipleUploadController)
