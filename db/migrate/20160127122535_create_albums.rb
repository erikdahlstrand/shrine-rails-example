class CreateAlbums < ActiveRecord::Migration
  def change
    create_table :albums do |t|

      t.timestamps null: false
    end
  end
end
