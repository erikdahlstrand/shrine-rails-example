class UploadJob
  include Sidekiq::Worker

  def perform(data)
    Shrine::Attacher.promote(data)
  end
end
