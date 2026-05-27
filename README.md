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

## Features

- 🌾 Crop Recommendation System
- 🦠 Plant Disease Detection
- 💧 Smart Irrigation Monitoring
- 🌦 Weather Forecast Integration
- 📊 Yield Prediction
- 🤖 AI-powered Farmer Assistant

## Stack

- Frontend: React, TypeScript, Tailwind CSS, Framer Motion, Recharts, Vite
- Backend: FastAPI, WebSockets, JWT auth, role-based access, MongoDB, Redis-ready services
- AI/ML: YOLOv8 disease detection inference, scikit-learn yield forecasting with trained model fallback, soil recommendation rules
- Deployment: Docker, Docker Compose, GitHub Actions, Vercel config, Render blueprint

## Project Structure

```text
frontend/       React TypeScript dashboard & PWA
backend/        FastAPI application and tests
data/           Data science datasets (CSV, streams)
models/         Trained model weights & estimators (joblib, pt)
notebooks/      Jupyter analytical research & experiments
ai-models/      ML preprocessing, training, and evaluation scripts
docker/         Docker Compose and Render deployment files
docs/           API and database documentation
```

## System Architecture

```mermaid
graph TD
    %% Styling
    classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef backend fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#15803d;
    classDef ai fill:#faf5ff,stroke:#9333ea,stroke-width:2px,color:#7e22ce;
    classDef db fill:#fef2f2,stroke:#dc2626,stroke-width:2px,color:#b91c1c;

    %% Nodes
    subgraph Client [React TypeScript Web Portal]
        UI["SaaS Dashboard & PWA <br/> (Framer Motion, Recharts)"]:::client
        WS["WebSocket Telemetry Client"]:::client
    end

    subgraph Server [FastAPI REST & Real-time Server]
        API["REST Endpoints <br/> (Auth, Soil, Yield, Weather, Chat)"]:::backend
        Stream["WebSocket Stream Gateways <br/> (/ws/monitoring)"]:::backend
    end

    subgraph AI [AI/ML Intelligence Layer]
        YOLO["YOLOv8 Plant Disease <br/> (OpenCV / PyTorch Inference)"]:::ai
        Yield["scikit-learn Predictor <br/> (Yield forecasting model)"]:::ai
        Rules["Agronomic Expert Rules <br/> (Soil health recommendation)"]:::ai
    end

    subgraph Data [Storage Layer]
        Mongo[("MongoDB Database <br/> (Users, Reports, History)")]:::db
    end

    %% Connections
    UI -->|HTTPS Requests| API
    WS <-->|Full-Duplex WS| Stream
    
    API -->|Image Payload| YOLO
    API -->|Acreage & Temp| Yield
    API -->|NPK & Soil Health| Rules

    API -->|Read/Write Documents| Mongo
    Stream -->|Fetch Context| Mongo
```

## Visual Showcase

### 📊 SaaS Operations Command Center
A modern, glassmorphic dark-mode dashboard providing real-time data stream insights and interactive telemetry tracking.
<div align="center">
  <img src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1000&q=80" alt="AgriNexus AI Dashboard Mockup" width="90%" style="border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.10);" />
</div>

### 🦠 AI-Driven Leaf Disease Scan
Deep-learning computer vision scans leaf models to detect pathogens, output confidence scores, and recommend custom chemical or organic treatments.
<div align="center">
  <img src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=1000&q=80" alt="YOLOv8 Plant Disease Inference scan" width="90%" style="border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.10);" />
</div>

### 💧 Telemetry Sensors & Weather Intelligence
Full-duplex WebSockets stream real-time soil moisture and gateway telemetry, coupled with 7-day predictive weather recommendation algorithms.
<div align="center">
  <img src="https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=1000&q=80" alt="IoT Field Telemetry Gateway" width="90%" style="border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.10);" />
</div>

### 📊 Yield Forecasting & Crop Mapping
Agronomic expert system rules and scikit-learn models predict yield margins using multispectral soil variables, regional databases, and historical trends.
<div align="center">
  <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80" alt="Multispectral crop mapping and yield analytics" width="90%" style="border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.10);" />
</div>

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
