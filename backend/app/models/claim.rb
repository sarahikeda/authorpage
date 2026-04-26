class Claim < ApplicationRecord
  belongs_to :profile

  enum state: { sent: "sent", verified: "verified", submitted: "submitted", expired: "expired" }

  before_validation :generate_token, on: :create
  validates :token, presence: true, uniqueness: true
  validates :email, presence: true

  scope :active, -> { where(state: %w[sent verified]).where("expires_at > ?", Time.current) }
  scope :verified, -> { where(state: "verified") }

  def mark_verified!
    update!(state: :verified, verified_at: Time.current)
  end

  def apply!(attrs, publish:)
    transaction do
      profile.update!(
        name: attrs[:name].presence || profile.name,
        tagline: attrs[:tagline],
        bio: attrs[:bio],
        website: attrs[:website],
        social_links: Array(attrs[:social_links]),
        tags: Array(attrs[:tags]),
        status: publish ? :claimed : profile.status,
        claimed_at: publish ? Time.current : profile.claimed_at,
      )
      update!(state: publish ? :submitted : state, submitted_at: publish ? Time.current : nil)
    end
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(32)
    self.expires_at ||= 14.days.from_now
  end
end
