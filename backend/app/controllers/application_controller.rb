class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable

  private

  def not_found(e)
    render json: { error: "Not found" }, status: :not_found
  end

  def unprocessable(e)
    render json: { error: e.record.errors.full_messages.to_sentence }, status: :unprocessable_entity
  end
end
