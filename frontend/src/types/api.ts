export type Role = "farmer" | "admin" | "agronomist";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  region?: string;
  preferred_language: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  role: Role;
}

export interface SoilAnalysisRequest {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  crop: string;
}

export interface SoilAnalysisResponse {
  health_score: number;
  status: string;
  fertilizer_recommendation: string;
  amendments: string[];
}

export interface FertilizerRecommendationRequest {
  crop: string;
  growth_stage: string;
  acreage: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  organic_matter_percent?: number;
  irrigation_available: boolean;
}

export interface FertilizerProductRecommendation {
  product: string;
  nutrient_focus: string;
  application_rate_kg_per_acre: number;
  timing: string;
  method: string;
}

export interface FertilizerRecommendationResponse {
  crop: string;
  growth_stage: string;
  nutrient_status: Record<string, string>;
  priority: string;
  recommended_products: FertilizerProductRecommendation[];
  application_plan: string[];
  soil_amendments: string[];
  cautions: string[];
  estimated_total_kg: number;
  confidence: number;
}

export interface YieldPredictionResponse {
  predicted_yield_tons: number;
  confidence: number;
  drivers: string[];
}
