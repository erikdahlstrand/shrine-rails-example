require "shrine"
require "shrine/storage/file_system"
require "image_processing/mini_magick"

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new("public", subdirectory: "uploads/cache"),
  store: Shrine::Storage::FileSystem.new("public", subdirectory: "uploads/store"),
}
