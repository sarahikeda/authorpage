module Api
  module V1
    module Admin
      class ProfilesController < ApplicationController
        def index
          scope = Profile.includes(:publisher, :books)
          scope = scope.search(params[:q]) if params[:q].present?
          scope = scope.where(kind: params[:type]) if params[:type].present?
          scope = scope.where(status: params[:status]) if params[:status].present?

          paged = scope.order(updated_at: :desc).page(params[:page]).per(50)
          render json: {
            items: paged.map { |p| AdminProfileSerializer.new(p).as_json },
            page: paged.current_page,
            total_pages: paged.total_pages,
            total: paged.total_count,
          }
        end

        def stats
          render json: {
            total: Profile.count,
            claimed: Profile.where(status: :claimed).count,
            pending: Profile.where(status: :pending).count,
            tagged: Profile.tagged.count,
          }
        end
      end

      class ClaimInvitesController < ApplicationController
        def create
          profile = Profile.find_by!(slug: params[:profile_slug])
          invite = ClaimInvite.create!(profile: profile, sent_by: current_admin)
          ClaimMailer.invitation(invite).deliver_later
          render json: { status: "sent", sent_at: invite.created_at }, status: :accepted
        end

        private

        def current_admin
          # TODO: replace with real admin auth (Devise or session-based).
          AdminUser.first
        end
      end
    end
  end
end
