class PhotosController < ApplicationController
  before_action :set_album

  def index
    @photos = @album.photos
  end

  def create
    photo = @album.photos.create(photo_params)
    render partial: "photo", locals: {photo: photo, idx: @album.photos.count}
  end

  def update
    @album.update(album_params)
    redirect_to root_path
  end

  private

  def set_album
    @album = Album.first_or_create!
  end

  def album_params
    params.require(:album).permit!
  end

  def photo_params
    params.require(:photo).permit!
  end
end
