# SIH26090 — Digital Craft Marketplace

An AI-powered platform that helps traditional artisans create professional digital product listings, get fair pricing recommendations, and sell through a marketplace.

## Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Mobile | Flutter / Dart | Artisan application |
| Web | Next.js / React / TypeScript | Admin dashboard + marketplace |
| Backend | FastAPI / Python | REST API, business logic |
| AI/ML | Python | Vision, speech, NLP, pricing |
| Database | PostgreSQL | Data persistence |
| Cache/Jobs | Redis | Caching and async jobs |
| Storage | S3-compatible | Product photos and audio |
| Deployment | Docker Compose | Local development |

## Prerequisites

- Git
- Flutter SDK 3.x+
- Python 3.12+
- Node.js LTS
- npm
- Docker Desktop

## Quick Start

### 1. Start databases

```bash
docker-compose up -d
```

### 2. Start API server

```bash
cd services/api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Verify: http://localhost:8000/health

### 3. Start web dashboard

```bash
cd apps/web
npm install
npm run dev
```

### 4. Start mobile app

```bash
cd apps/mobile
flutter pub get
flutter run
```

## Project Structure

```
sih26090/
├── apps/
│   ├── mobile/          # Flutter artisan app
│   └── web/             # Next.js admin dashboard
├── services/
│   ├── api/             # FastAPI backend
│   └── ai/              # AI/ML services
├── packages/            # Shared contracts and types
├── database/            # Migrations and seeds
├── data/                # Datasets and samples
├── docs/                # Documentation
├── infrastructure/      # Docker, nginx, deployment
└── scripts/             # Automation scripts
```

## Key Flows

```
Artisan → Photo → AI Enhancement → Voice → Catalog → Pricing → Publish
Customer → Browse → Cart → Order
Admin → Dashboard → Analytics
```

## License

MIT
