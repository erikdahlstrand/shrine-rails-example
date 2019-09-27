class Photo < ActiveRecord::Base
  include ImageUploader::Attachment(:image)  # ImageUploader will attach and manage `image`
end
