class CreateClaims < ActiveRecord::Migration[7.1]
  def change
    create_table :claims do |t|
      t.references :profile, null: false, foreign_key: true
      t.string :token, null: false, index: { unique: true }
      t.string :email, null: false
      t.string :state, null: false, default: "sent"
      t.datetime :verified_at
      t.datetime :submitted_at
      t.datetime :expires_at, null: false
      t.timestamps
    end
  end
end
