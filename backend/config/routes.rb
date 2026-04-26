Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :profiles, only: :show, param: :slug do
        resources :books, only: :index, controller: "profiles/books"
        resources :claims, only: :create, controller: "claims", as: :start_claims
      end

      resources :claims, only: [], param: :token do
        member do
          post :verify
          patch "", action: :update
        end
      end

      namespace :admin do
        resources :profiles, only: :index, param: :slug do
          collection { get :stats }
          resources :claim_invites, only: :create
        end
      end
    end
  end
end
