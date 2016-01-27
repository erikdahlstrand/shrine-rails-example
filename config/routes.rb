Rails.application.routes.draw do
  resources :photos

  root to: 'photos#index'

  mount ImageUploader::UploadEndpoint, at: "/attachments/images"
end
