class Photo < ActiveRecord::Base
  include ImageUploader::Attachment.new(:image)
end
