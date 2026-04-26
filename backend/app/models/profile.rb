class Profile < ApplicationRecord
  enum kind: { author: "author", narrator: "narrator" }, _suffix: true
  enum status: { unclaimed: "unclaimed", pending: "pending", claimed: "claimed" }

  belongs_to :publisher, optional: true
  has_many :authorships, dependent: :destroy
  has_many :books, through: :authorships
  has_many :claims, dependent: :destroy

  validates :slug, presence: true, uniqueness: true
  validates :name, presence: true

  scope :tagged, -> { where("array_length(tags, 1) > 0") }
  scope :search, ->(q) { where("name ILIKE :q OR slug ILIKE :q", q: "%#{q}%") }

  def social_links
    self[:social_links] || []
  end

  def tags
    self[:tags] || []
  end
end
