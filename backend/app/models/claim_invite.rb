class ClaimInvite < ApplicationRecord
  belongs_to :profile
  belongs_to :sent_by, class_name: "AdminUser", optional: true
end
