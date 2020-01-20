class Photo < ActiveRecord::Base
  include ImageUploader::Attachment(:image)  # ImageUploader will attach and manage `image`

  validates_presence_of :image
end
