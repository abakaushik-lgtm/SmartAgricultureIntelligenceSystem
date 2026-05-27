<div align="center">
  <img src="https://images.unsplash.com/photo-1500937386664-56d159062255?auto=format&fit=crop&w=1200&h=350&q=80" alt="AgriNexus AI Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  # 🌱 AgriNexus AI

  ### *Next-Generation Smart Agriculture Decision Support & Intelligence Engine*

  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)

  *Empowering modern growers with real-time sensor telemetry, AI-driven crop disease diagnostics, agronomic yield predictions, and weather-aware decision networks.*

  ---
  [Core Features](#core-features) • [Local Setup](#local-setup) • [Docker Compose](#docker) • [API Documentation](/docs/api/openapi.md)
  ---
</div>

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
