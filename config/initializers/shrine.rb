require "shrine"
require "shrine/storage/file_system"

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new("public", subdirectory: "uploads/cache"),
  store: Shrine::Storage::FileSystem.new("public", subdirectory: "uploads/store"),
}

Shrine.plugin :activerecord
Shrine.plugin :logging, logger: Rails.logger
