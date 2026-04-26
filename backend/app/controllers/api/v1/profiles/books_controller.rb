module Api
  module V1
    module Profiles
      class BooksController < ApplicationController
        def index
          profile = Profile.find_by!(slug: params[:profile_slug])
          books = profile.books.published.order(released_at: :desc)
          paged = books.page(params[:page]).per(params.fetch(:per_page, 24))

          render json: {
            items: paged.map { |b| BookSerializer.new(b).as_json },
            page: paged.current_page,
            total_pages: paged.total_pages,
            total: paged.total_count,
          }
        end
      end
    end
  end
end
