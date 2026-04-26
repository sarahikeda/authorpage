module Api
  module V1
    class ProfilesController < ApplicationController
      def show
        profile = Profile.find_by!(slug: params[:slug])
        render json: ProfileSerializer.new(profile).as_json
      end
    end
  end
end
