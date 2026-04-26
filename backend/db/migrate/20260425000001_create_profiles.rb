class CreateProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :publishers do |t|
      t.string :name, null: false
      t.timestamps
    end

    create_table :profiles do |t|
      t.string :slug, null: false, index: { unique: true }
      t.string :kind, null: false
      t.string :name, null: false
      t.string :tagline
      t.text   :bio
      t.string :website
      t.text   :social_links, array: true, default: []
      t.text   :tags, array: true, default: []
      t.string :status, null: false, default: "unclaimed"
      t.references :publisher, foreign_key: true
      t.datetime :claimed_at
      t.timestamps
    end

    add_index :profiles, :kind
    add_index :profiles, :status
    add_index :profiles, :tags, using: :gin
  end
end
