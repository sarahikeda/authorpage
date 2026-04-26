class BookSerializer
  def initialize(book)
    @book = book
  end

  def as_json(*)
    {
      slug: @book.slug,
      title: @book.title,
      subtitle: @book.subtitle,
      byline: @book.byline,
      duration: @book.duration_str,
      price: @book.price_str,
      released_at: @book.released_at,
    }
  end
end
