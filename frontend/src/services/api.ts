import axios from "axios";
import type {
  FertilizerRecommendationRequest,
  FertilizerRecommendationResponse,
  SoilAnalysisRequest,
  SoilAnalysisResponse,
  TokenResponse,
  User,
  YieldPredictionResponse,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agrinexus_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", { email, password });
  return data;
}

export async function signup(payload: { name: string; email: string; password: string; role: string; region?: string }): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/signup", payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function analyzeSoil(payload: SoilAnalysisRequest): Promise<SoilAnalysisResponse> {
  const { data } = await api.post<SoilAnalysisResponse>("/soil/analyze", payload);
  return data;
}

export async function recommendFertilizer(
  payload: FertilizerRecommendationRequest,
): Promise<FertilizerRecommendationResponse> {
  const { data } = await api.post<FertilizerRecommendationResponse>("/fertilizer/recommend", payload);
  return data;
}

export async function predictYield(): Promise<YieldPredictionResponse> {
  const { data } = await api.post<YieldPredictionResponse>("/yield/predict", {
    crop: "rice",
    region: "Punjab",
    acreage: 12,
    rainfall_mm: 820,
    avg_temperature_c: 27,
    soil_health_score: 78
  });
  return data;
}
