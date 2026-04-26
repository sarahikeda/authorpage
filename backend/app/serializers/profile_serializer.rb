class ProfileSerializer
  def initialize(profile, draft: false)
    @profile = profile
    @draft = draft
  end

  def as_json(*)
    {
      slug: @profile.slug,
      kind: @profile.kind,
      name: @profile.name,
      tagline: @profile.tagline,
      bio: @profile.bio,
      website: @profile.website,
      social_links: @profile.social_links,
      tags: @profile.tags,
      links: build_links,
      claimed: @profile.claimed?,
      draft: @draft,
    }
  end

  private

  def build_links
    links = []
    links << { label: hostname(@profile.website), url: @profile.website, icon: "↗" } if @profile.website.present?
    @profile.social_links.each do |url|
      links << { label: hostname(url), url: url, icon: icon_for(url) }
    end
    links
  end

  def hostname(url)
    URI.parse(url).host&.sub(/^www\./, "")
  rescue URI::InvalidURIError
    url
  end

  def icon_for(url)
    case url
    when /instagram\.com/ then "◐"
    when /substack\.com/ then "✎"
    when /x\.com|twitter\.com/ then "✺"
    else "↗"
    end
  end
end
