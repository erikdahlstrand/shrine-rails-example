class Album < ActiveRecord::Base
  has_many :photos, dependent: :destroy
  accepts_nested_attributes_for :photos, allow_destroy: true

  include ImageUploader::Attachment.new(:cover_photo)

  validates_presence_of :name, :cover_photo
end
