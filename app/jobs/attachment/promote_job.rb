class Attachment::PromoteJob < ApplicationJob
  def perform(attacher_class, record, name, file_data)
    attacher_class = Object.const_get(attacher_class)

    attacher = attacher_class.retrieve(model: record, name: name, file: file_data)
    attacher.create_derivatives if record.is_a?(Album)
    attacher.atomic_promote
  rescue Shrine::AttachmentChanged, ActiveRecord::RecordNotFound
    # attachment has changed or the record has been deleted, nothing to do
  end
end
