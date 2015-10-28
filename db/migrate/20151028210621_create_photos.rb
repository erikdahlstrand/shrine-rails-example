class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.text :image_data

      t.timestamps null: false
    end
  end
end
