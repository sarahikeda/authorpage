module Api
  module V1
    class ClaimsController < ApplicationController
      # POST /api/v1/profiles/:profile_slug/claims
      def create
        profile = Profile.find_by!(slug: params[:profile_slug])
        claim = profile.claims.create!(email: params.require(:email))
        ClaimMailer.verification(claim).deliver_later
        render json: { status: "sent" }, status: :accepted
      end

      # POST /api/v1/claims/:token/verify
      def verify
        claim = Claim.active.find_by!(token: params[:token])
        claim.mark_verified!
        render json: ProfileSerializer.new(claim.profile, draft: true).as_json
      end

      # PATCH /api/v1/claims/:token
      def update
        claim = Claim.verified.find_by!(token: params[:token])
        claim.apply!(claim_params, publish: ActiveModel::Type::Boolean.new.cast(params[:publish]))
        render json: ProfileSerializer.new(claim.profile.reload).as_json
      end

      private

      def claim_params
        params.permit(:name, :tagline, :bio, :website, social_links: [], tags: [])
      end
    end
  end
end
