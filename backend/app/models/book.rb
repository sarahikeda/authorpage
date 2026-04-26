class Book < ApplicationRecord
  has_many :authorships, dependent: :destroy
  has_many :profiles, through: :authorships

  scope :published, -> { where.not(released_at: nil).where("released_at <= ?", Time.current) }

  def byline
    author = profiles.where(authorships: { role: "author" }).first
    narrator = profiles.where(authorships: { role: "narrator" }).first
    author && narrator ? "Narrated by #{narrator.name}" : "By #{(author || narrator)&.name}"
  end

  def duration_str
    return nil unless duration_seconds
    h = duration_seconds / 3600
    m = (duration_seconds % 3600) / 60
    "#{h}h #{m.to_s.rjust(2, '0')}m"
  end

  def price_str
    return nil unless price_cents
    format("$%.2f", price_cents / 100.0)
  end
end
