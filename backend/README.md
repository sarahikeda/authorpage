# Libro.fm Author Profiles — Rails backend

API-only Rails 7.1 application that serves the author/narrator profile pages,
the claim flow, and the admin dashboard.

## Layout

```
backend/
├── Gemfile
├── config.ru
├── config/
│   ├── application.rb
│   ├── environments/development.rb
│   ├── routes.rb
│   └── initializers/cors.rb
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   └── api/v1/
│   │       ├── profiles_controller.rb
│   │       ├── claims_controller.rb
│   │       └── admin/
│   │           └── profiles_controller.rb
│   ├── models/
│   │   ├── application_record.rb
│   │   ├── profile.rb
│   │   ├── book.rb
│   │   ├── claim.rb
│   │   └── claim_invite.rb
│   └── serializers/
│       ├── profile_serializer.rb
│       ├── book_serializer.rb
│       └── admin_profile_serializer.rb
└── db/
    └── migrate/
        ├── 20260425000001_create_profiles.rb
        ├── 20260425000002_create_books.rb
        ├── 20260425000003_create_claims.rb
        └── 20260425000004_create_claim_invites.rb
```

## Endpoints (matches `js/api.js`)

| Method | Path                                              | Purpose                          |
| ------ | ------------------------------------------------- | -------------------------------- |
| GET    | `/api/v1/profiles/:slug`                          | Author or narrator profile       |
| GET    | `/api/v1/profiles/:slug/books`                    | Paginated audiobooks for profile |
| POST   | `/api/v1/profiles/:slug/claims`                   | Start a claim (sends email)      |
| POST   | `/api/v1/claims/:token/verify`                    | Verify token, return draft data  |
| PATCH  | `/api/v1/claims/:token`                           | Submit claim (publish or draft)  |
| GET    | `/api/v1/admin/profiles`                          | Filtered/paginated admin list    |
| GET    | `/api/v1/admin/profiles/stats`                    | KPI counts                       |
| POST   | `/api/v1/admin/profiles/:slug/claim_invites`      | Send claim invite                |

## Running locally

```sh
cd backend
bundle install
bin/rails db:setup
bin/rails s -p 3000
```

The static frontend at the repo root expects the API at
`http://localhost:3000/api/v1` (override via `window.__LIBROFM_CONFIG`).

## Eventual migration

This backend is structured to also render server-side ERB views for the same
URLs, replacing the static HTML files. The JSON API stays in `Api::V1::*`; the
ERB views will live under `app/views/profiles/`, `app/views/claims/`, and
`app/views/admin/profiles/`, sharing the existing serializers as presenters.
