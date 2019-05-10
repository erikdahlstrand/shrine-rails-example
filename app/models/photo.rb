class Photo < ActiveRecord::Base
  include DynamicImageUploader::Attachment.new(:image)  # ImageUploader will attach and manage `image`
end
