Rails.application.routes.draw do
  root to: "albums#index"

  resources :albums


  if Rails.configuration.upload_server == :s3
    # By default in production we use s3, including upload directly to S3 with
    # signed url.
    mount Shrine.presign_endpoint(:cache) => "/s3/params"
  elsif Rails.configuration.upload_server == :s3_multipart
    # Still upload directly to S3, but using Uppy's AwsS3Multipart plugin
    mount Shrine.uppy_s3_multipart(:cache) => "/s3"
  else # :app
    # In development and test environment by default we're using filesystem storage
    # for speed, so on the client side we'll upload files to our app.
    mount Shrine.upload_endpoint(:cache) => "/upload"
  end

  mount DynamicImageUploader.derivation_endpoint => "/derivations/image"
end
