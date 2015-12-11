Rails.application.routes.draw do
  resources :photos

  root to: 'photos#index'

  mount ImageUploader.direct_endpoint, at: "/attachments/images"
end
