# AgriNexus AI

AgriNexus AI is a full-stack Smart Agriculture Intelligence Platform for crop monitoring, disease detection, yield prediction, soil analysis, weather intelligence, real-time sensor simulation, admin analytics, and AI farming assistance.

## Stack

- Frontend: React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Vite
- Backend: FastAPI, WebSockets, JWT auth, role-based access, MongoDB, Redis-ready services
- AI/ML: YOLOv8 disease detection inference, scikit-learn yield forecasting with trained model fallback, soil recommendation rules
- Deployment: Docker, Docker Compose, GitHub Actions, Vercel config, Render blueprint

## Project Structure

```text
frontend/       React TypeScript dashboard
backend/        FastAPI application and tests
ai-models/      Training, preprocessing, evaluation, sample datasets
docker/         Docker Compose and Render deployment files
docs/           API and database documentation
```

## Local Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Docker

```bash
docker compose -f docker/docker-compose.yml up --build
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:8000`, Swagger at `http://localhost:8000/docs`.

## Core Features

- Farmer/admin authentication with JWT and password hashing
- Role-based admin endpoints
- Crop disease image upload API ready for YOLOv8 weights
- Soil health scoring and fertilizer recommendations
- Yield prediction API and training script
- 7-day weather intelligence service interface
- AI chatbot integration point for OpenAI, Gemini, or HuggingFace
- WebSocket sensor simulation stream
- Responsive SaaS dashboard with dark/light mode
- PWA manifest, Dockerfiles, CI workflow, and deployment config

## Production Notes

Replace `.env.example` secrets before deployment. Use MongoDB Atlas for `MONGO_URI`, a managed Redis instance for cache/session workloads, Firebase Admin credentials for federated login, and object storage for uploaded disease images. Train YOLOv8 with a labeled plant disease dataset, then set `DISEASE_MODEL_PATH` to the exported weights.
