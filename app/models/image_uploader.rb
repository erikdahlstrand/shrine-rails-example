require "image_processing/mini_magick"

class ImageUploader < Shrine
  include ImageProcessing::MiniMagick

  plugin :determine_mime_type
  plugin :remove_attachment
  plugin :store_dimensions
  plugin :validation_helpers
  plugin :versions, names: [:original, :thumb]

  Attacher.validate do
    validate_max_size 5.megabytes, message: 'is too large (max is 5 MB)'
    validate_mime_type_inclusion ['image/jpeg', 'image/png', 'image/gif']
  end

  def process(io, context)
    case context[:phase]
    when :store
      thumb = resize_to_limit!(io.download, 200, 200)
      { original: io, thumb: thumb }
    end
  end
end
