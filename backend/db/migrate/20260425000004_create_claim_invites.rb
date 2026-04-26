class CreateClaimInvites < ActiveRecord::Migration[7.1]
  def change
    create_table :admin_users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :name
      t.timestamps
    end

    create_table :claim_invites do |t|
      t.references :profile, null: false, foreign_key: true
      t.references :sent_by, foreign_key: { to_table: :admin_users }
      t.timestamps
    end
  end
end
