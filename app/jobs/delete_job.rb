class DeleteJob
  include SuckerPunch::Job

  def perform(data)
    Shrine::Attacher.delete(data)
  end
end
