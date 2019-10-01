require "shrine"

# By default use S3 for production and local file for other environments
case Rails.configuration.upload_server
when :s3, :s3_multipart
  require "shrine/storage/s3"

  s3_options = {
    access_key_id:     Rails.application.credentials.s3.access_key_id,
    secret_access_key: Rails.application.credentials.s3.secret_access_key,
    region:            Rails.application.credentials.s3.region,
    bucket:            Rails.application.credentials.s3.bucket,
  }

  # both `cache` and `store` storages are needed
  Shrine.storages = {
    cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
    store: Shrine::Storage::S3.new(**s3_options),
  }
when :app
  require "shrine/storage/file_system"

  # both `cache` and `store` storages are needed
  Shrine.storages = {
    cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"),
    store: Shrine::Storage::FileSystem.new("public", prefix: "uploads"),
  }
end

Shrine.plugin :activerecord
Shrine.plugin :instrumentation
Shrine.plugin :determine_mime_type, analyzer: :marcel, log_subscriber: nil
Shrine.plugin :cached_attachment_data
Shrine.plugin :restore_cached_data
Shrine.plugin :derivatives          # up front processing
Shrine.plugin :derivation_endpoint, # on-the-fly processing
  secret_key: Rails.application.credentials.secret_key_base

case Rails.configuration.upload_server
when :s3
  Shrine.plugin :presign_endpoint, presign_options: -> (request) {
    # Uppy will send the "filename" and "type" query parameters
    filename = request.params["filename"]
    type     = request.params["type"]

    {
      content_disposition:    ContentDisposition.inline(filename), # set download filename
      content_type:           type,                                # set content type
      content_length_range:   0..(10*1024*1024),                   # limit upload size to 10 MB
    }
  }
when :s3_multipart
  Shrine.plugin :uppy_s3_multipart
when :app
  Shrine.plugin :upload_endpoint
end

# delay promoting and deleting files to a background job (`backgrounding` plugin)
Shrine.plugin :backgrounding
Shrine::Attacher.promote_block do
  Attachment::PromoteJob.perform_later(self.class.name, record, name, file_data)
end
Shrine::Attacher.destroy_block do
  Attachment::DestroyJob.perform_later(self.class.name, data)
end
