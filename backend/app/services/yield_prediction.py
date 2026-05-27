from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.core.config import get_settings
from app.schemas.agriculture import YieldPredictionRequest, YieldPredictionResponse


def _load_yield_model():
    model_path = Path(get_settings().yield_model_path)
    if not model_path.exists():
        return None
    try:
        return joblib.load(model_path)
    except Exception:
        return None


def _format_drivers(model, payload: YieldPredictionRequest) -> list[str]:
    if model is not None and hasattr(model, "named_steps"):
        if hasattr(model.named_steps["model"], "feature_importances_"):
            return ["crop variety", "region", "soil health", "weather conditions"]
    return ["soil health", "rainfall", "temperature", "regional crop baseline"]


def _confidence_from_model(model, payload: YieldPredictionRequest, prediction: float) -> float:
    if model is None:
        return 0.78
    estimator = getattr(model.named_steps.get("model"), "estimators_", None)
    if estimator is None:
        return 0.85
    df = pd.DataFrame([payload.model_dump()])
    predictions = np.array([est.predict(df)[0] for est in estimator])
    std = float(np.std(predictions))
    return round(max(0.55, min(0.95, 1 - std / max(abs(prediction), 1))), 2)


def _fallback_prediction(payload: YieldPredictionRequest) -> tuple[float, list[str], float]:
    crop_factor = {"rice": 3.8, "wheat": 3.1, "maize": 4.2, "cotton": 2.2}.get(payload.crop.lower(), 2.8)
    rainfall_factor = min(payload.rainfall_mm / 900, 1.2)
    temp_factor = max(0.55, 1 - abs(payload.avg_temperature_c - 26) / 45)
    soil_factor = payload.soil_health_score / 100
    predicted = payload.acreage * crop_factor * (0.45 + rainfall_factor * 0.2 + temp_factor * 0.15 + soil_factor * 0.2)
    return round(predicted, 2), ["soil health", "rainfall", "temperature", "regional crop baseline"], 0.82


def predict_yield(payload: YieldPredictionRequest) -> YieldPredictionResponse:
    model = _load_yield_model()
    if model is None:
        predicted, drivers, confidence = _fallback_prediction(payload)
    else:
        try:
            df = pd.DataFrame([payload.model_dump()])
            raw_prediction = float(model.predict(df)[0])
            predicted = round(raw_prediction, 2)
            drivers = _format_drivers(model, payload)
            confidence = _confidence_from_model(model, payload, predicted)
        except Exception:
            predicted, drivers, confidence = _fallback_prediction(payload)

    return YieldPredictionResponse(
        predicted_yield_tons=predicted,
        confidence=confidence,
        drivers=drivers,
    )
