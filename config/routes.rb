Rails.application.routes.draw do
  root to: 'photos#index'

  patch "/album" => "photos#update"
  post "/album/photos" => "photos#create"

  mount ImageUploader::UploadEndpoint, at: "/attachments/images"
end
