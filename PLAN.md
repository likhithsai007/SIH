# SIH26090 — Implementation & Development Plan

## 1. Recommended Architecture

**Use: Flutter + Next.js/React + FastAPI/Python + PostgreSQL + Redis.**

| Layer | Recommendation | Purpose |
|---|---|---|
| Mobile | Flutter / Dart | Android/iOS artisan application |
| Web | Next.js / React / TypeScript | Admin dashboard + marketplace |
| Backend | FastAPI / Python | REST API, business logic, AI orchestration |
| AI/ML | Python | Vision, speech, NLP, translation, pricing |
| Database | PostgreSQL | Users, artisans, products, orders, analytics |
| Cache/jobs | Redis | Caching and asynchronous AI jobs |
| Storage | S3-compatible object storage | Product photos and audio |
| Deployment | Docker / Docker Compose | Reproducible environments |

### Kotlin vs Flutter vs Java

**Choose Flutter.**

- Flutter gives one mobile codebase.
- Kotlin is excellent for native Android, but creates more platform-specific work.
- Java is not recommended as the primary application technology for this project.
- Use Kotlin only for an Android-native feature when a Flutter plugin is insufficient.

For the web application, use **Next.js**, not Flutter Web. Your dashboard needs dense tables, filters, charts, forms and web-oriented workflows.

---

# 2. Product Vision

The core workflow should be:

```text
Physical Craft
    |
    v
Flutter Artisan App
    |
    +--> Camera --> AI image enhancement
    |
    +--> Voice --> Speech-to-text --> NLP --> Catalog
    |
    +--> Cost/material data --> Pricing engine
    |
    v
Professional digital listing
    |
    v
Marketplace
    |
    v
Customer
    |
    v
Order
    |
    v
Admin analytics
```

The key experience should be:

> **Take photo → speak → review → price → publish.**

---

# 3. User Roles

## Artisan

- Register/login
- Create profile
- Select language
- Capture/upload product photos
- Enhance images
- Record voice description
- Generate AI catalog
- Edit AI output
- Get price recommendation
- Publish products
- View orders
- View analytics

## Customer

- Browse marketplace
- Search/filter products
- View product and artisan profiles
- Add to cart
- Place demo order
- Track order

## Admin / Program Manager

- View artisans
- View products
- View orders
- View regional distribution
- View categories
- View AI usage
- View sales/impact metrics
- Manage users and categories

---

# 4. MVP Scope

P0 features:

1. Authentication
2. Artisan profile
3. Product creation
4. Photo upload
5. AI image enhancement
6. Voice recording
7. Speech-to-text
8. AI catalog generation
9. Regional-language support
10. AI price recommendation
11. Product publishing
12. Marketplace
13. Basic order flow
14. Artisan analytics
15. Admin dashboard

Do not build advanced integrations until this complete flow works.

---

# 5. Monorepo Structure

```text
sih26090/
├── README.md
├── PLAN.md
├── LICENSE
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── apps/
│   ├── mobile/
│   │   ├── lib/
│   │   │   ├── core/
│   │   │   │   ├── constants/
│   │   │   │   ├── errors/
│   │   │   │   ├── network/
│   │   │   │   ├── storage/
│   │   │   │   └── theme/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── onboarding/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── camera/
│   │   │   │   ├── voice_catalog/
│   │   │   │   ├── pricing/
│   │   │   │   ├── orders/
│   │   │   │   └── analytics/
│   │   │   ├── shared/
│   │   │   └── main.dart
│   │   ├── test/
│   │   └── pubspec.yaml
│   │
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── features/
│       │   │   ├── dashboard/
│       │   │   ├── artisans/
│       │   │   ├── products/
│       │   │   ├── orders/
│       │   │   └── analytics/
│       │   ├── lib/
│       │   └── types/
│       ├── public/
│       └── tests/
│
├── services/
│   ├── api/
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── config.py
│   │   │   ├── api/
│   │   │   │   ├── deps.py
│   │   │   │   └── routes/
│   │   │   │       ├── auth.py
│   │   │   │       ├── artisans.py
│   │   │   │       ├── products.py
│   │   │   │       ├── ai.py
│   │   │   │       ├── pricing.py
│   │   │   │       ├── marketplace.py
│   │   │   │       ├── orders.py
│   │   │   │       └── analytics.py
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── security/
│   │   │   └── workers/
│   │   ├── tests/
│   │   ├── alembic/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   └── ai/
│       ├── vision/
│       │   ├── background_removal/
│       │   ├── enhancement/
│       │   └── quality/
│       ├── speech/
│       │   ├── transcription/
│       │   └── language_detection/
│       ├── nlp/
│       │   ├── extraction/
│       │   ├── catalog_generation/
│       │   └── translation/
│       ├── pricing/
│       │   ├── data/
│       │   ├── features/
│       │   ├── models/
│       │   ├── training/
│       │   └── inference/
│       └── tests/
│
├── packages/
│   ├── api-contracts/
│   ├── shared-types/
│   └── design-tokens/
│
├── database/
│   ├── migrations/
│   ├── seed/
│   └── scripts/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── sample/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── ai/
│   ├── ui/
│   ├── testing/
│   └── demo/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── deployment/
│
└── scripts/
    ├── setup/
    ├── development/
    ├── database/
    └── deployment/
```

---

# 6. Initial Setup

## Step 1 — Install

Required:

- Git
- Flutter SDK
- Android Studio + Android SDK
- VS Code
- Python 3.12+
- Node.js LTS
- npm/pnpm
- Docker Desktop
- Postman/Insomnia

Verify:

```bash
git --version
flutter --version
python --version
node --version
npm --version
docker --version
```

## Step 2 — Create repository

```bash
mkdir sih26090
cd sih26090
git init

mkdir apps services packages database data docs infrastructure scripts

touch README.md PLAN.md .env.example .gitignore docker-compose.yml
```

## Step 3 — Create Flutter app

```bash
cd apps
flutter create mobile
cd mobile
flutter run
```

Verify the default application works on an Android emulator or physical device.

## Step 4 — Create web app

From `apps/`:

```bash
npx create-next-app@latest web
```

Select:

```text
TypeScript: Yes
ESLint: Yes
Tailwind: Yes
src/: Yes
App Router: Yes
```

Run:

```bash
cd web
npm run dev
```

## Step 5 — Create FastAPI

```bash
cd services
mkdir api
cd api

python -m venv .venv
```

Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Install:

```bash
pip install fastapi uvicorn sqlalchemy psycopg[binary] alembic pydantic-settings python-multipart
```

Create `app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="SIH26090 API")

@app.get("/health")
def health():
    return {"status": "ok"}
```

Run:

```bash
uvicorn app.main:app --reload
```

Check:

```text
http://localhost:8000/health
http://localhost:8000/docs
```

---

# 7. Environment

`.env.example`:

```env
APP_ENV=development

DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/sih26090
REDIS_URL=redis://localhost:6379

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

LLM_API_KEY=
SPEECH_API_KEY=
TRANSLATION_API_KEY=

JWT_SECRET=
```

Never commit `.env`, API keys or production secrets.

---

# 8. Database Design

Initial tables:

```text
users
artisans
customers
products
product_images
product_attributes
catalogs
pricing_predictions
market_listings
orders
order_items
market_data
raw_material_prices
ai_jobs
analytics_events
```

Core relationship:

```text
User
  |
  +-- Artisan
        |
        +-- Product
              |
              +-- Images
              +-- Attributes
              +-- Catalog
              +-- PricingPrediction
              +-- MarketListing
```

Use SQLAlchemy + Alembic.

Do not manually edit production tables.

---

# 9. Authentication

Roles:

```text
ARTISAN
CUSTOMER
ADMIN
```

Flow:

```text
Register
  |
Login
  |
JWT/session
  |
Protected API
```

Authorization must be enforced by FastAPI. Frontend route hiding is not security.

---

# 10. Product API

Implement first:

```http
POST   /products
GET    /products/{product_id}
PUT    /products/{product_id}
DELETE /products/{product_id}
GET    /products
```

Example:

```json
{
  "name": "Handmade Cotton Bag",
  "category_id": "bags",
  "material": "cotton",
  "description": "Handmade cotton bag",
  "base_cost": 450
}
```

The basic CRUD system must work before AI development begins.

---

# 11. AI Image Studio

Endpoint:

```http
POST /ai/image/enhance
```

Pipeline:

```text
Upload
  |
Validate
  |
Quality check
  |
Background segmentation/removal
  |
Crop/center
  |
Lighting enhancement
  |
Save output
```

Keep:

```text
original_image
processed_image
```

Never overwrite the original.

Long operations should become background jobs.

---

# 12. Voice Catalog

Endpoint:

```http
POST /ai/catalog/from-voice
```

Pipeline:

```text
Audio
  |
Speech-to-text
  |
Language detection
  |
Normalized text
  |
Attribute extraction
  |
Catalog generation
  |
Translation
  |
Validation
  |
Editable draft
```

Example output:

```json
{
  "title": "Handcrafted Cotton Tote Bag",
  "description": "...",
  "category": "Bags",
  "material": ["Cotton", "Jute"],
  "color": null,
  "size": null,
  "tags": ["handmade", "cotton bag"],
  "language_source": "te"
}
```

The artisan must be able to edit AI output before publishing.

Never invent missing attributes.

---

# 13. Pricing Engine

Use a hybrid approach rather than an LLM-only price.

Inputs:

```text
material cost
labor hours
labor rate
packaging cost
category
dimensions
quality
market prices
regional demand
season
```

Output:

```json
{
  "recommended_price": 799,
  "minimum_price": 699,
  "maximum_price": 849,
  "confidence": 0.82
}
```

Also provide an explanation:

```text
Material cost
Labor cost
Packaging
Market adjustment
Demand adjustment
```

Start with a deterministic baseline formula. Add ML only after the baseline is working.

Suitable first ML models:

```text
XGBoost
LightGBM
Random Forest
```

Track:

```text
MAE
RMSE
percentage within acceptable market range
confidence calibration
```

Do not claim accuracy without measured evaluation.

---

# 14. Marketplace

Build an internal marketplace first.

Routes:

```text
/marketplace
/marketplace/products
/marketplace/products/{id}
```

API:

```http
GET  /marketplace/products
GET  /marketplace/products/{id}
GET  /marketplace/categories
POST /orders
GET  /orders/{id}
```

Features:

```text
Search
Categories
Filters
Product details
Artisan profile
Cart
Demo order
```

Only after this works should you implement external marketplace integrations.

---

# 15. Marketplace Adapter

Keep external integrations replaceable:

```text
MarketplaceAdapter
    |
    +-- InternalMarketplaceAdapter
    +-- ONDCAdapter
    +-- GeMAdapter
```

Do not hard-code one marketplace throughout the application.

Only call an external integration "live" after it has actually been tested.

---

# 16. Admin Dashboard

Routes:

```text
/admin
/admin/artisans
/admin/products
/admin/orders
/admin/analytics
/admin/ai
```

KPIs:

```text
Total Artisans
Active Artisans
Products Listed
AI Catalogs Generated
Images Enhanced
Orders
GMV
Average Order Value
Regional Reach
```

Charts:

```text
Products by category
Artisans by region
Orders over time
Revenue over time
Top products
AI adoption
```

---

# 17. Mobile Screens

Build in this order:

```text
1. Splash
2. Login
3. Register
4. Language selection
5. Artisan onboarding
6. Home
7. Add product
8. Camera
9. Image processing result
10. Voice catalog
11. AI catalog editor
12. Pricing
13. Publish
14. Product details
15. Orders
16. Analytics
17. Profile
```

Recommended Flutter state management:

**Riverpod**

Use one state-management approach across the project.

---

# 18. Web Screens

Build in this order:

```text
1. Admin login
2. Dashboard
3. Artisan list
4. Artisan details
5. Product list
6. Product details
7. Orders
8. Analytics
9. Marketplace
10. Marketplace product page
11. Customer order flow
```

Keep API calls outside UI components.

---

# 19. Development Strategy

Build vertical slices rather than isolated layers.

### Slice 1

```text
Flutter
  -> FastAPI
  -> PostgreSQL
  -> Create artisan
```

### Slice 2

```text
Flutter camera
  -> FastAPI
  -> Vision AI
  -> Storage
  -> Mobile result
```

### Slice 3

```text
Voice
  -> FastAPI
  -> Speech/NLP
  -> Catalog
  -> Editable listing
```

### Slice 4

```text
Product
  -> Pricing
  -> Price UI
```

### Slice 5

```text
Product
  -> Marketplace
  -> Customer
  -> Order
```

### Slice 6

```text
Orders
  -> Analytics
  -> Admin dashboard
```

---

# 20. Team Division — 6 Members

### Member 1 — Flutter

Own:

```text
apps/mobile/
```

### Member 2 — Computer Vision

Own:

```text
services/ai/vision/
```

### Member 3 — Speech/NLP

Own:

```text
services/ai/speech/
services/ai/nlp/
```

### Member 4 — Backend

Own:

```text
services/api/
database/
```

### Member 5 — Pricing/ML

Own:

```text
services/ai/pricing/
services/ai/recommendations/
```

### Member 6 — Web

Own:

```text
apps/web/
```

Everyone must integrate through agreed API contracts.

---

# 21. Git Workflow

Branches:

```text
main
develop
feature/*
bugfix/*
```

Never work directly on `main`.

Examples:

```text
feature/flutter-auth
feature/product-api
feature/image-enhancement
feature/voice-catalog
feature/pricing
feature/admin-dashboard
```

Commit examples:

```text
feat: add artisan registration
feat: add product image upload
feat: add voice catalog generation
fix: handle failed image processing
docs: update API contract
refactor: extract pricing service
```

---

# 22. Engineering Rules

1. Keep AI behind APIs.
2. Never trust AI output without validation.
3. Never invent product attributes.
4. Keep original images.
5. Make AI operations retryable.
6. Use background jobs for expensive operations.
7. Keep external integrations behind adapters.
8. Keep secrets out of Git.
9. Validate uploads.
10. Do not overengineer into many microservices.
11. Document API contracts.
12. Build and test on a real Android device.

---

# 23. AI Provider Abstraction

Avoid hard-coding the entire platform to one AI provider.

Use interfaces such as:

```text
LLMProvider
SpeechProvider
TranslationProvider
VisionProvider
```

Implementations can later be swapped between:

```text
Cloud API
Local model
Open-source model
Different vendor
```

This is particularly important for SIH deployment and cost control.

---

# 24. Offline / Low Connectivity

At minimum:

- Save unfinished drafts locally
- Cache profile data
- Record voice before upload
- Queue uploads
- Compress images
- Show upload progress

Architecture:

```text
Local Draft
   |
Sync Queue
   |
Backend
```

This is a useful domain-specific feature for artisans.

---

# 25. Security

Implement:

- HTTPS
- secure authentication
- password hashing
- RBAC
- file validation
- size limits
- rate limiting
- input validation
- parameterized queries/ORM
- secret management
- admin audit logs

For uploaded files:

```text
Validate extension
Validate MIME type
Validate file signature
Limit size
Generate random storage filename
Strip unnecessary metadata where appropriate
```

---

# 26. Testing

## Backend

Use pytest for:

```text
Auth
Products
Pricing
Catalog
Marketplace
Orders
```

## Flutter

Test:

```text
Widgets
Navigation
Forms
API clients
Critical workflows
```

## Web

Test:

```text
Dashboard
Filters
Product pages
Authentication
Responsive layout
```

## AI

Create a fixed evaluation set:

```text
10–50 product images
10–50 voice examples
multiple languages
multiple product categories
```

Track:

### Vision

- Quality
- Background-removal quality
- Product preservation
- Processing time

### Speech

- Word Error Rate where ground truth exists
- Language detection accuracy

### Catalog

- Attribute extraction accuracy
- Hallucination rate
- Translation quality
- Human acceptance rate

### Pricing

- MAE
- RMSE
- Range accuracy
- Calibration

---

# 27. Performance

Target:

```text
Normal API request       < 2 sec
Dashboard load           < 3 sec
Pricing inference        near real-time
AI image processing      asynchronous
Speech processing        asynchronous
```

For long tasks:

```text
POST /ai/image/enhance

{
  "job_id": "JOB123",
  "status": "processing"
}
```

Then:

```text
GET /ai/jobs/JOB123
```

Possible states:

```text
queued
processing
completed
failed
requires_review
```

---

# 28. Roadmap

## Phase 0 — Planning

```text
[ ] Freeze requirements
[ ] Freeze stack
[ ] Database schema
[ ] API contracts
[ ] UI flows
[ ] Git repository
```

## Phase 1 — Foundation

```text
[ ] Flutter starts
[ ] Next.js starts
[ ] FastAPI starts
[ ] PostgreSQL connects
[ ] Redis connects
[ ] Docker Compose works
```

## Phase 2 — Auth/Profile

```text
[ ] Register
[ ] Login
[ ] Logout
[ ] Roles
[ ] Artisan profile
```

## Phase 3 — Products

```text
[ ] Create
[ ] Upload
[ ] View
[ ] Edit
[ ] Delete
[ ] Draft
```

## Phase 4 — AI Image Studio

```text
[ ] Quality check
[ ] Background removal
[ ] Enhancement
[ ] Crop
[ ] Storage
[ ] Before/after UI
```

## Phase 5 — Voice Catalog

```text
[ ] Recording
[ ] Transcription
[ ] Language detection
[ ] Attribute extraction
[ ] Catalog generation
[ ] Translation
[ ] Editing
```

## Phase 6 — Pricing

```text
[ ] Dataset
[ ] Baseline
[ ] ML model
[ ] Prediction API
[ ] Range
[ ] Confidence
[ ] Explanation
```

## Phase 7 — Marketplace

```text
[ ] Publish
[ ] Search
[ ] Filters
[ ] Product page
[ ] Artisan page
[ ] Cart
[ ] Demo order
```

## Phase 8 — Dashboard

```text
[ ] KPIs
[ ] Artisans
[ ] Products
[ ] Orders
[ ] Regional analytics
[ ] Category analytics
[ ] AI analytics
```

## Phase 9 — Integration

Run:

```text
Register
 -> Product
 -> Photo
 -> AI image
 -> Voice
 -> AI catalog
 -> Pricing
 -> Publish
 -> Marketplace
 -> Order
 -> Analytics
```

## Phase 10 — Hardening

```text
[ ] Error handling
[ ] Loading states
[ ] Offline drafts
[ ] Security review
[ ] Performance
[ ] Crash testing
[ ] Real-device testing
[ ] Responsive web testing
```

## Phase 11 — SIH Demo

```text
[ ] Demo account
[ ] Demo artisan
[ ] Demo products
[ ] Demo images
[ ] Demo voice
[ ] Backup AI outputs
[ ] Seeded marketplace
[ ] Architecture diagram
[ ] Presentation
[ ] Demo script
```

---

# 29. Demo Dataset

Prepare:

```text
5 artisans
20 products
3 categories
3 languages
10 product images
5 voice samples
pricing records
20+ marketplace products
sample orders
```

Do not depend on live external data during the final presentation.

---

# 30. Demo Reliability

Use two modes:

```text
LIVE MODE
  |
  +-- normal AI/API execution

FALLBACK MODE
  |
  +-- cached image result
  +-- cached catalog result
  +-- cached pricing result
  +-- seeded marketplace
```

The fallback should be an application-level recovery path, not a separate fake presentation.

---

# 31. Final SIH Demo Script

## 0:00–0:30 — Problem

Show:

```text
Physical products
Poor product photography
Language barrier
Limited digital skills
Pricing uncertainty
Limited market access
```

## 0:30–1:30 — AI Image

```text
Before -> AI -> After
```

## 1:30–2:30 — Voice Catalog

```text
Regional-language voice
  ->
Text
  ->
Attributes
  ->
Professional catalog
```

## 2:30–3:15 — Pricing

```text
Recommended: ₹799
Range: ₹699–₹849

Why:
Material
Labor
Packaging
Market
Demand
```

## 3:15–4:00 — Marketplace

Publish the product and show it in the marketplace.

## 4:00–4:30 — Impact

Show:

```text
Artisans
Products
Orders
Revenue
Regions
AI usage
```

---

# 32. Definition of Done

A feature is complete only when:

```text
[ ] API works
[ ] Database integration works
[ ] Mobile/web integration works
[ ] Loading state exists
[ ] Error state exists
[ ] Empty state exists
[ ] Validation exists
[ ] Tests exist where appropriate
[ ] Documentation updated
[ ] Real-device/browser test completed
```

---

# 33. Final Acceptance Criteria

```text
[ ] Artisan registration
[ ] Artisan login
[ ] Artisan profile
[ ] Product creation
[ ] Photo upload
[ ] AI image enhancement
[ ] Voice recording
[ ] Speech-to-text
[ ] Catalog generation
[ ] Regional language
[ ] Editable AI output
[ ] Pricing recommendation
[ ] Pricing explanation
[ ] Product publishing
[ ] Marketplace listing
[ ] Customer demo order
[ ] Artisan order view
[ ] Admin analytics
[ ] Error handling
[ ] Android device testing
[ ] Web dashboard testing
[ ] Demo fallback
[ ] No secrets committed
```

---

# 34. Exact Starting Order

Do these in order:

```text
1. Create GitHub repository
2. Create monorepo
3. Create Flutter app
4. Create Next.js app
5. Create FastAPI app
6. Start PostgreSQL
7. Connect FastAPI -> PostgreSQL
8. Implement authentication
9. Implement artisan profile
10. Implement product CRUD
11. Connect Flutter -> API
12. Connect Web -> API
13. Verify complete CRUD flow
14. Implement AI Image Studio
15. Implement Voice Catalog
16. Implement Pricing
17. Implement Marketplace
18. Implement Analytics
19. Harden application
20. Prepare SIH demo
```

## Most important rule

**Do not start with the AI features.**

First prove this:

```text
Flutter
   ↓
FastAPI
   ↓
PostgreSQL
   ↓
Next.js
```

with a working artisan/product flow.

Then add AI as independent capabilities.

This prevents the common SIH failure mode where the project has impressive AI demonstrations but no integrated product.
