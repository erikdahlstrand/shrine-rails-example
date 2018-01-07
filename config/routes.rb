Rails.application.routes.draw do
  root to: 'albums#index'

  resources :albums

  if Rails.env.production?
    mount Shrine.presign_endpoint(:cache) => "/presign"
  else
    # In development and test environment we're using filesystem storage
    # for speed, so on the client side we'll upload files to our app.
    mount Shrine.upload_endpoint(:cache) => "/upload"
  end
end
