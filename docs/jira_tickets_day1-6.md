# Jira Ticket Drafts — Day 1 to Day 6

Below are draft tickets you can copy into Jira. Each ticket has a short description, acceptance criteria, priority, and estimated time.

---

## DAY 1 — Project Setup & Database

- **TASK-001 — Repo & README**
  - Description: Initialize Git repository, add professional README with quickstart, architecture, environment variables and run instructions.
  - Acceptance: `README.md` contains quickstart steps for backend/frontend, architecture diagram screenshot, and env var examples.
  - Priority: High
  - Estimate: 1h

- **TASK-002 — Monorepo skeleton**
  - Description: Create monorepo folders `/frontend`, `/backend`, `/ai-service`, `/database`, `/docs` with minimal `package.json` placeholders.
  - Acceptance: Folders exist and `npm install` works in `frontend` and `backend`.
  - Priority: High
  - Estimate: 1h

- **TASK-003 — ERD, migrations & seed plan**
  - Description: Design ERD, create Prisma schema and seed plan to insert realistic products (50+).
  - Acceptance: `schema.prisma` + migration files present and seed script exists (seed runs locally).
  - Priority: High
  - Estimate: 3h

- **TASK-007 — Lint + Prettier + Husky**
  - Description: Add ESLint, Prettier and Husky pre-commit hooks; add `npm run lint` script.
  - Acceptance: `npm run lint` passes locally and pre-commit auto-formats staged files.
  - Priority: Medium
  - Estimate: 2h

---

## DAY 2 — Authentication

- **TASK-009 — JWT Auth (register/login/refresh/logout)**
  - Description: Implement secure JWT-based auth, refresh tokens, and logout behavior.
  - Acceptance: Register/login returns access/refresh tokens; refresh returns new access token; logout invalidates refresh token.
  - Priority: High
  - Estimate: 4h

- **TASK-010 — Password hashing**
  - Description: Hash passwords using bcrypt (12 rounds) and validate on login.
  - Acceptance: Stored passwords are hashed; login verifies hash.
  - Priority: High
  - Estimate: 1h

- **TASK-011 — Email verification**
  - Description: Send verification email (Nodemailer + Ethereal dev preview); only verified users can perform certain actions.
  - Acceptance: Registration sends email preview URL in dev and `verify` flow marks user verified.
  - Priority: Medium
  - Estimate: 2h

- **TASK-012 — Roles middleware**
  - Description: Add middleware for `customer`, `admin`, `vendor` roles and protect admin endpoints.
  - Acceptance: Non-admin users receive 403 for admin routes.
  - Priority: Medium
  - Estimate: 1.5h

---

## DAY 3 — Design System & Homepage

- **TASK-017 — Design tokens & doc**
  - Description: Finalize colors, typography, spacing in `/docs/design.md` and include usage examples.
  - Acceptance: `docs/design.md` updated; components use tokens.
  - Priority: Medium
  - Estimate: 2h

- **TASK-018 — Component library**
  - Description: Implement `Navbar`, `ProductCard`, `Footer`, `CategoryPill`, `FilterSidebar`, `SortDropdown` as reusable components.
  - Acceptance: Components exist and are imported by pages; storybook or sample page shows components.
  - Priority: Medium
  - Estimate: 4h

- **TASK-019 → TASK-024 — Homepage features**
  - Description: Hero carousel, category grid, trending carousel, new-arrivals skeleton, dark mode toggle, mobile nav.
  - Acceptance: Homepage responsive, skeletons on load, toggles work.
  - Priority: Medium
  - Estimate: 4–6h

---

## DAY 4 — Product Catalog & Search

- **TASK-025 — Product API**
  - Description: Implement product CRUD and listing endpoints with pagination and filters.
  - Acceptance: `GET /api/products` supports `q`, `page`, `limit`, `category`.
  - Priority: High
  - Estimate: 3h

- **TASK-026 — Category API**
  - Description: Return category hierarchy for filters and category pages.
  - Acceptance: `GET /api/products/categories` returns categories array.
  - Priority: Medium
  - Estimate: 1h

- **TASK-027 — Full-text search (prod)**
  - Description: Implement Postgres `tsvector`/GIN indexing for production; dev can use substring search.
  - Acceptance: Search returns relevant results and indexes improve query time.
  - Priority: Medium
  - Estimate: 3h

- **TASK-028 — Pagination & filtering**
  - Description: Back-end pagination, sorting, price range, size/color filters.
  - Acceptance: Backend accepts filters and returns paged results.
  - Priority: Medium
  - Estimate: 3h

---

## DAY 5 — PDP & Cart

- **TASK-035 — PDP UX**
  - Description: Image gallery with zoom, thumbnails, size/color selectors, description tabs, add-to-cart interaction.
  - Acceptance: PDP shows images and selectors; add-to-cart adds item to cart UI.
  - Priority: High
  - Estimate: 4h

- **TASK-036 — Cart API**
  - Description: Implement cart endpoints (GET, add, update qty, remove, clear) and store per-user carts.
  - Acceptance: Cart endpoints return and update items per user.
  - Priority: High
  - Estimate: 3h

- **TASK-037 — Guest cart merge**
  - Description: Merge guest local cart into user cart on login.
  - Acceptance: Items saved in guest cart appear in user cart after login without duplication.
  - Priority: Medium
  - Estimate: 2h

- **TASK-039 — Wishlist**
  - Description: Implement wishlist toggle and wishlist page persisted per user.
  - Acceptance: Wishlist saved per user and toggled from PDP/PLP.
  - Priority: Low
  - Estimate: 2h

---

## DAY 6 — Checkout & Payment

- **TASK-041 — Orders API (create + list + status)**
  - Description: Create orders, validate stock, calculate totals; admin can update statuses.
  - Acceptance: Orders can be created, listed, fetched, and status updated by admin.
  - Priority: High
  - Estimate: 3h

- **TASK-042 — Addresses CRUD**
  - Description: Add address book (CRUD) endpoints for shipping addresses.
  - Acceptance: Addresses persisted per user and selectable in checkout.
  - Priority: Medium
  - Estimate: 2h

- **TASK-043 — Payment mock & COD flow**
  - Description: Integrate a mock card flow (Stripe test mode simulation) and COD option.
  - Acceptance: Card payments simulate success/failure in dev; COD creates pending order.
  - Priority: High
  - Estimate: 3h

---

If you want, I can now create these Jira tickets directly (requires Jira access), or add them to your project management tool of choice. The next steps I'm about to run locally are: run `npm audit fix`, run type checks and build, then commit and push changes to a feature branch and open a PR (if remote configured).
