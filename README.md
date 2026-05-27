<div align="center">
  <img src="https://images.unsplash.com/photo-1500937386664-56d159062255?auto=format&fit=crop&w=1200&h=350&q=80" alt="AgriNexus AI Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  # 🌱 AgriNexus AI

  ### *Next-Generation Smart Agriculture Decision Support & Intelligence Engine*

  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

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

## Technology Stack

The platform is engineered using modern, high-performance web frameworks, real-time data streaming architectures, and advanced machine learning models:

| Layer | Technologies | Badges | Core Function & Integration |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite | [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)](https://react.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript)](https://typescript.org) | Asynchronous single-page dashboard with glassmorphic styling, responsive layout controls, and dark/light toggles. |
| **Styling & Motion** | Tailwind CSS, Framer Motion | [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com) [![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer)](https://framer.com) | Responsive utility-first layouts, custom thematic colors, smooth list enter/exit transitions, and micro-interactions. |
| **Charts** | Recharts, Lucide Icons | [![Recharts](https://img.shields.io/badge/Recharts-22c55e?style=flat&logo=d3)](https://recharts.org) | Interactive time-series yield area charts, dynamic field health bar graphs, and customized SVG alert icons. |
| **API Backend** | FastAPI, Uvicorn, Python 3.14 | [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com) [![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python)](https://python.org) | Modular, type-safe REST router layers utilizing Pydantic validation schemas, auto-generated Swagger docs, and CORS. |
| **Realtime Telemetry** | WebSockets (Asynchronous) | [![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=flat&logo=socket.io)](https://fastapi.tiangolo.com) | Full-duplex connection gateways streaming simulated sensor gateway metrics (moisture, temperature) at 3s intervals. |
| **Security** | JWT Tokens, Hashed Bcrypt | [![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens)](https://jwt.io) | Token-based stateless authentication flow with secure password salting, token expiration, and role-based endpoints. |
| **Database** | MongoDB, Motor Client | [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb)](https://mongodb.com) | Document-oriented storage layer serving high-speed write speeds for sensor reports, user profiles, and chat logs. |
| **AI / Computer Vision** | YOLOv8 (Ultralytics), OpenCV | [![YOLOv8](https://img.shields.io/badge/YOLOv8-OpenCV-blue?style=flat&logo=opencv)](https://opencv.org) | Leaf disease image classification and detection layer outputting pathogen confidence percentages and treatment advice. |
| **AI / Analytics** | Scikit-Learn, Pandas, NumPy | [![Scikit](https://img.shields.io/badge/scikit_learn-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org) | Machine learning yield forecasting regressions evaluating acreage parameters, moisture averages, and soil score models. |
| **Infrastructure** | Docker, Github Actions | [![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker)](https://docker.com) | Platform-agnostic deployment configurations including multi-stage Dockerfiles and CI build workflows. |

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

## 🚀 Installation Guide

### Prerequisites

| Requirement | Version | Purpose |
| :--- | :--- | :--- |
| **Python** | 3.10+ | Backend API runtime |
| **Node.js** | 18+ | Frontend build toolchain |
| **npm** | 9+ | Package management |
| **MongoDB** | 6.0+ or Atlas | Document database |
| **Git** | 2.x | Version control |
| **Docker** *(optional)* | 24+ | Containerized deployment |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/abakaushik-lgtm/SmartAgricultureIntelligenceSystem.git
cd SmartAgricultureIntelligenceSystem
```

### 2️⃣ Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, API keys, and secrets (see table below)

# Start the FastAPI development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> 🟢 Backend API will be live at **http://localhost:8000**
> 📖 Interactive Swagger docs at **http://localhost:8000/docs**

### 3️⃣ Frontend Setup

```bash
# Navigate to the frontend directory (from project root)
cd frontend

# Install Node.js dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

# Start the Vite development server
npm run dev
```

> 🟢 Frontend dashboard will be live at **http://localhost:5173**

### 4️⃣ Docker Compose (One-Command Setup)

Spin up the entire stack with a single command:

```bash
docker compose -f docker/docker-compose.yml up --build
```

| Service | URL |
| :--- | :--- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| MongoDB | localhost:27017 |

### 🔐 Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `MONGO_URI` | ✅ | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | ✅ | Secret key for JWT token signing |
| `JWT_ALGORITHM` | ✅ | Token algorithm (default: `HS256`) |
| `WEATHER_API_KEY` | ⬜ | OpenWeatherMap API key for forecasts |
| `DISEASE_MODEL_PATH` | ⬜ | Path to trained YOLOv8 `.pt` weights |
| `OPENAI_API_KEY` | ⬜ | API key for AI chatbot integration |
| `REDIS_URL` | ⬜ | Redis connection URL for caching |
| `FIREBASE_CREDENTIALS` | ⬜ | Path to Firebase Admin SDK JSON |

### 🧪 Running Tests

```bash
# Backend unit tests
cd backend
pytest -v

# Frontend tests (if configured)
cd frontend
npm run test
```

---

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

---

## 🔮 Future Enhancements

> *Making agriculture smarter — one model at a time.*

| Enhancement | Description | Status |
| :--- | :--- | :---: |
| 🛰️ **Satellite Image Analysis** | Integrate NDVI and multispectral satellite imagery for large-scale crop health monitoring using Sentinel-2 data | 🔬 Research |
| 🚁 **Drone Monitoring** | Autonomous UAV flight path planning with real-time aerial imaging and anomaly detection | 📋 Planned |
| 📡 **Real-time IoT Integration** | Connect physical IoT sensor gateways (ESP32, LoRa) for live soil moisture, temperature, and humidity telemetry | 📋 Planned |
| 📱 **Mobile Application** | Cross-platform React Native mobile app with offline-first capabilities and push notifications for crop alerts | 📋 Planned |
| 🌍 **Multilingual Farmer Chatbot** | AI-powered conversational assistant supporting Hindi, Telugu, Tamil, Punjabi, and 10+ regional Indian languages | 🔬 Research |
| 🧬 **Crop Genome Analytics** | Predictive modeling for optimal seed variety selection based on soil composition and regional climate data | 🔬 Research |
| 🏪 **Marketplace Integration** | Direct-to-consumer produce marketplace connecting farmers with buyers using dynamic pricing algorithms | 📋 Planned |
| 📈 **Government Scheme Recommender** | AI engine that matches eligible farmers with central and state agricultural subsidy programs | 📋 Planned |

---

## Production Notes

Replace `.env.example` secrets before deployment. Use MongoDB Atlas for `MONGO_URI`, a managed Redis instance for cache/session workloads, Firebase Admin credentials for federated login, and object storage for uploaded disease images. Train YOLOv8 with a labeled plant disease dataset, then set `DISEASE_MODEL_PATH` to the exported weights.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

  **Built with ❤️ for the future of agriculture**

  [![GitHub Stars](https://img.shields.io/github/stars/abakaushik-lgtm/SmartAgricultureIntelligenceSystem?style=social)](https://github.com/abakaushik-lgtm/SmartAgricultureIntelligenceSystem)
  [![GitHub Forks](https://img.shields.io/github/forks/abakaushik-lgtm/SmartAgricultureIntelligenceSystem?style=social)](https://github.com/abakaushik-lgtm/SmartAgricultureIntelligenceSystem/fork)

  *If this project helped you, consider giving it a ⭐*

</div>
