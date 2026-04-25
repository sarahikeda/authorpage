# Author & Narrator Profiles — Design Doc

**Status:** Prototype for stakeholder review
**Owner:** Sarah Ikeda
**Last updated:** 2026-04-25

---

## 1. Problem

Today, Libro.fm catalog pages link authors and narrators only as plain-text
search filters (`/search?author=Jason+Mott`). There is no canonical home for a
creator on the site — no bio, no photo, no curated selection of their catalog,
no way for readers to follow them, and no way for the creator to influence how
they are represented.

This blocks three things:

1. **SEO** — we have no indexable creator pages. Readers searching an author
   name land on third-party sites instead of our catalog.
2. **Reader connection** — Libro.fm sells itself on supporting indie
   bookstores and the people behind books. The product doesn't currently
   surface "the people."
3. **Creator marketing** — authors and narrators have no asset on Libro.fm to
   share with their audience, and we have no consented channel to feature
   them in thematic campaigns ("Pacific Northwest writers," "Women in
   translation," "Authors who narrate").

## 2. Goals

- Ship canonical, indexable profile pages for every author and narrator with
  at least one title in the Libro.fm catalog.
- Let creators **claim** their profile, verify their identity, and edit
  publisher-submitted information.
- Let creators **opt in** to thematic campaign tags — never auto-applied for
  identity-based tags (region, background).
- Give Libro.fm staff an admin view to track claim funnel health and invite
  high-value unclaimed profiles.

### Non-goals (v1)

- Long-form author posts / blog / newsletter integration.
- Reader-facing "follow" notifications. (Capture follow intent only; no
  notification delivery yet.)
- Direct messaging between readers and creators.
- Royalty or sales reporting to creators.

## 3. Information architecture

| Route | Page | Audience |
|---|---|---|
| `/authors/[slug]` | Author profile | Public |
| `/narrators/[slug]` | Narrator profile | Public |
| `/claim/[token]` | Verification + edit + tag flow | Invited creator |
| `/admin/profiles` | Profile dashboard | Libro.fm staff |

Slug is `kebab-case-of-display-name` with disambiguation suffix on collision
(e.g. `jason-mott`, `jason-mott-2`).

## 4. Page-by-page

### 4.1 Author / narrator profile (`index.html`, `narrator.html`)

Same layout for both; only the eyebrow label and breadcrumb change.

- **Hero:** photo (square, 320px), eyebrow ("Author" / "Narrator"), display
  name, bio (1–3 paragraphs), pill-style social links, primary CTA.
- **Catalog grid:** every audiobook on Libro.fm with this person credited.
  4-up on desktop, 2-up on mobile. Sort: newest first.
  Narrator pages cap at 12 with "View all" — narrators routinely have 50+ credits.
- **Claim CTA banner:** dark, pinned below the catalog. Disappears once
  the profile is claimed.
- **Footer:** standard Libro.fm site footer.

**Empty / unclaimed state.** When no claim exists, the bio shown is
publisher-submitted (or auto-generated from the back catalog), with a small
"Unclaimed profile" pill so readers know it isn't authored by the creator yet.

### 4.2 Claim flow (`claim.html`)

Linear, four-step. Step indicator at top.

1. **Verify.** Creator clicks a tokenized link emailed to an address Libro.fm
   has on file from the publisher (or, for self-published / narrator-only
   creators, an address verified out-of-band). Token is single-use, expires
   in 14 days.
2. **Review profile.** Editable fields prefilled with publisher-submitted
   data: display name, tagline, bio, website, socials. The page makes it
   obvious which fields came from the publisher and what the public sees today
   (notice block at the top).
3. **Tags & consent.** Optional thematic tags split into:
   - **Catalog-derived suggestions** (genre, "Authors who narrate") —
     pre-checked but reversible.
   - **Identity-based tags** (region, background, language community) —
     **never pre-checked**. Self-identification only, with clear
     descriptions of how each tag is used in campaigns.
4. **Submit.** Profile publishes immediately. Creator gets a confirmation
   email with a link to manage from `/account/profile`.

**Recoverable mistakes.** Any field can be re-edited from the account
settings page after claim. Tag opt-ins can be revoked at any time.

### 4.3 Admin profiles dashboard (`admin.html`)

For internal team use. Single-screen view of:

- **KPIs:** total profiles, claimed count, % claimed, pending verifications
  >14 days, profiles tagged for campaigns.
- **Filters:** type (author / narrator), claim status, campaign tag,
  publisher.
- **Table:** name, type, title count, status badge, tags, last activity,
  per-row action (send claim link, resend, view).
- **Actions:** invite to claim (single or bulk via CSV).

The table is the primary funnel view — surface unclaimed profiles with the
most listens so we know who to prioritize for outreach.

## 5. Visual design

Matches the live Libro.fm system:

- **Background:** white (`#ffffff`)
- **Type:** Larsseit / Inter sans, 800-weight headings with negative
  letter-spacing, 500–700 weight for UI
- **Accents:**
  - Teal `#5cc0bf` — primary CTA, brand mark, claim accents
  - Purple `#7c5fe0` — secondary CTA (mirrors the live "Get for $14.99
    with membership" treatment) — reserved for future use, not currently
    needed on the profile page
  - Black `#111` — outline buttons, dark banner background
  - Soft gray `#f6f6f6` — admin sidebar, form field backgrounds
- **Buttons:** fully pill-shaped (`border-radius: 999px`), 1.5px borders.
- **Cards:** 4–10px corner radius, 1px gray border, no heavy shadows.

## 6. Trust & privacy

- **Identity tags are opt-in only.** We do not infer "Indigenous,"
  "Latine," "queer," or any identity tag from a creator's catalog or name.
  Auto-suggestions are limited to genre and credit-derived facts ("authors
  who narrate" = "you have a narrator credit on a title where you are also
  the author").
- **Reversible.** Creators can un-tag, edit, or unclaim at any time. Unclaim
  reverts the profile to the publisher-submitted state and clears
  consent-based tags.
- **No third-party scraping.** Bios are seeded from publisher feeds we
  already ingest, never from open web scrapes — to avoid stale or
  unauthorized text appearing on a creator's page.

## 7. Open questions

1. **Verification for self-published authors.** Many of our long-tail
   creators don't have a known publisher email on file. v1 plan:
   self-service request that routes through manual review. Worth scoping
   a domain-verification path (DNS TXT or email at the domain on the
   author's existing website) for v2.
2. **Disambiguation of common names.** Slugs collide (Jason Mott vs.
   Jason Gots). v1 uses suffix slugs and shows publisher under the name in
   search results. v2 may need a "Did you mean…?" disambiguator on the
   profile page itself.
3. **Authors-as-narrators.** Eleanor Ashworth narrating her own book
   should appear on both her `/authors/` and `/narrators/` pages. v1
   shows the same person at two routes; long-term we may want a single
   `/people/` route with role badges.
4. **Bookseller picks placement.** The live PDP shows "Booksellers also
   recommend" and bookseller-created playlists. Should the author profile
   page surface "Booksellers who recommend Eleanor Ashworth"? Captured
   for v2.

## 8. Rollout

- **Phase 1 — Read-only profiles.** Generate `/authors/` and `/narrators/`
  routes for the entire catalog, seeded from publisher data. No claim flow.
  Validates SEO lift and reader engagement.
- **Phase 2 — Claim flow.** Open claim links to top-listened-to creators
  first (top 1,000), iterate on the flow, then open self-service requests.
- **Phase 3 — Campaign tags & admin.** Once we have a meaningful claimed
  cohort, ship consent-based tags and the admin dashboard for ops to run
  thematic campaigns.

## 9. Prototype

Static HTML/CSS in this repo. Open `index.html` to start.

- `index.html` — author profile (Eleanor Ashworth)
- `narrator.html` — narrator profile (Cassandra Lin)
- `claim.html` — claim flow, step 2 (review profile + tag opt-in)
- `admin.html` — admin profiles dashboard
- `styles.css` — shared design tokens and components
