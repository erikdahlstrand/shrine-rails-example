class Photo < ActiveRecord::Base
  include ImageUploader[:image]
end
