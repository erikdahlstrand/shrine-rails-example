class DeleteJob
  include Sidekiq::Worker

  def perform(data)
    Shrine::Attacher.delete(data)
  end
end
