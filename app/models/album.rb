class Album < ActiveRecord::Base
  has_many :photos, dependent: :destroy
  accepts_nested_attributes_for :photos, allow_destroy: true

  include ImageUploader::Attachment(:cover_photo)  # ImageUploader will attach and manage `cover_photo`

  validates_presence_of :name, :cover_photo  # Normal model validations - optional
end
