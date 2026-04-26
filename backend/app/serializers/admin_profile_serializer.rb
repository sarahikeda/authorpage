class AdminProfileSerializer
  def initialize(profile)
    @profile = profile
  end

  def as_json(*)
    {
      slug: @profile.slug,
      name: @profile.name,
      kind: @profile.kind,
      publisher: @profile.publisher&.name,
      title_count: @profile.books.size,
      status: @profile.status,
      tags: @profile.tags,
      last_activity: last_activity_label,
    }
  end

  private

  def last_activity_label
    ts = @profile.claimed_at || @profile.updated_at
    return "—" unless ts
    days = ((Time.current - ts) / 1.day).to_i
    case days
    when 0 then "Today"
    when 1 then "Yesterday"
    when 2..6 then "#{days} days ago"
    when 7..13 then "1 week ago"
    when 14..29 then "#{days / 7} weeks ago"
    else ts.strftime("%b %-d")
    end
  end
end
