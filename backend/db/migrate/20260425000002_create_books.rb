class CreateBooks < ActiveRecord::Migration[7.1]
  def change
    create_table :books do |t|
      t.string :slug, null: false, index: { unique: true }
      t.string :title, null: false
      t.string :subtitle
      t.integer :duration_seconds
      t.integer :price_cents
      t.datetime :released_at
      t.timestamps
    end

    create_table :authorships do |t|
      t.references :profile, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.string :role, null: false # "author" | "narrator"
      t.timestamps
    end

    add_index :authorships, [:profile_id, :book_id, :role], unique: true
  end
end
