require "image_processing/mini_magick"

class ImageUploader < Shrine
  include ImageProcessing::MiniMagick

  plugin :determine_mime_type
  plugin :remove_attachment
  plugin :store_dimensions
  plugin :validation_helpers
  plugin :pretty_location
  plugin :processing
  plugin :versions

  Attacher.validate do
    validate_max_size 5.megabytes, message: 'is too large (max is 5 MB)'
    validate_mime_type_inclusion ['image/jpeg', 'image/png', 'image/gif']
  end

  process(:store) do |io|
    thumb = resize_to_limit!(io.download, 200, 200)
    { original: io, thumb: thumb }
  end
end
