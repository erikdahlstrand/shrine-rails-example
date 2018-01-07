module ApplicationHelper
  def upload_server
    if Rails.env.production?
      :s3
    else
      :app
    end
  end
end
