class Attachment::DestroyJob < ApplicationJob
  def perform(data)
    attacher = Shrine::Attacher.from_data(data)
    attacher.destroy
  end
end
