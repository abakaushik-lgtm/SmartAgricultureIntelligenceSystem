from app.schemas.agriculture import (
    FertilizerProductRecommendation,
    FertilizerRecommendationRequest,
    FertilizerRecommendationResponse,
)


CROP_TARGETS: dict[str, dict[str, float]] = {
    "rice": {"nitrogen": 120, "phosphorus": 60, "potassium": 60},
    "wheat": {"nitrogen": 100, "phosphorus": 50, "potassium": 45},
    "maize": {"nitrogen": 130, "phosphorus": 55, "potassium": 65},
    "cotton": {"nitrogen": 90, "phosphorus": 45, "potassium": 75},
    "sugarcane": {"nitrogen": 150, "phosphorus": 60, "potassium": 90},
}

STAGE_MULTIPLIERS: dict[str, dict[str, float]] = {
    "seedling": {"nitrogen": 0.45, "phosphorus": 0.7, "potassium": 0.45},
    "vegetative": {"nitrogen": 1.0, "phosphorus": 0.8, "potassium": 0.7},
    "flowering": {"nitrogen": 0.65, "phosphorus": 0.75, "potassium": 1.0},
    "fruiting": {"nitrogen": 0.55, "phosphorus": 0.65, "potassium": 1.15},
    "grain filling": {"nitrogen": 0.45, "phosphorus": 0.55, "potassium": 1.0},
}


def _status(value: float, target: float) -> str:
    ratio = value / target if target else 1
    if ratio < 0.55:
        return "severe_deficit"
    if ratio < 0.85:
        return "deficit"
    if ratio > 1.25:
        return "excess"
    return "optimal"


def _priority(statuses: dict[str, str], ph: float, moisture: float) -> str:
    if "severe_deficit" in statuses.values() or ph < 5.5 or ph > 8.2 or moisture < 25:
        return "high"
    if "deficit" in statuses.values() or ph < 6 or ph > 7.8 or moisture < 35:
        return "medium"
    return "low"


def recommend_fertilizer(payload: FertilizerRecommendationRequest) -> FertilizerRecommendationResponse:
    crop_key = payload.crop.lower()
    stage_key = payload.growth_stage.lower()
    crop_targets = CROP_TARGETS.get(crop_key, {"nitrogen": 100, "phosphorus": 50, "potassium": 55})
    multipliers = STAGE_MULTIPLIERS.get(stage_key, STAGE_MULTIPLIERS["vegetative"])
    adjusted_targets = {key: crop_targets[key] * multipliers[key] for key in crop_targets}

    measured = {
        "nitrogen": payload.nitrogen,
        "phosphorus": payload.phosphorus,
        "potassium": payload.potassium,
    }
    statuses = {key: _status(value, adjusted_targets[key]) for key, value in measured.items()}

    products: list[FertilizerProductRecommendation] = []
    if statuses["nitrogen"] in {"deficit", "severe_deficit"}:
        rate = 35 if statuses["nitrogen"] == "severe_deficit" else 22
        products.append(
            FertilizerProductRecommendation(
                product="Urea or neem-coated urea",
                nutrient_focus="nitrogen",
                application_rate_kg_per_acre=rate,
                timing="Split into two doses, first before irrigation and second after 12-15 days.",
                method="Broadcast evenly and irrigate lightly after application.",
            )
        )
    if statuses["phosphorus"] in {"deficit", "severe_deficit"}:
        rate = 45 if statuses["phosphorus"] == "severe_deficit" else 28
        products.append(
            FertilizerProductRecommendation(
                product="DAP or single super phosphate",
                nutrient_focus="phosphorus",
                application_rate_kg_per_acre=rate,
                timing="Apply as a basal dose near the root zone.",
                method="Band placement is preferred to improve phosphorus availability.",
            )
        )
    if statuses["potassium"] in {"deficit", "severe_deficit"}:
        rate = 35 if statuses["potassium"] == "severe_deficit" else 24
        products.append(
            FertilizerProductRecommendation(
                product="Muriate of potash",
                nutrient_focus="potassium",
                application_rate_kg_per_acre=rate,
                timing="Apply before flowering or stress-prone periods.",
                method="Broadcast or band place, then irrigate if soil is dry.",
            )
        )

    amendments: list[str] = []
    cautions: list[str] = []
    if payload.ph < 6:
        amendments.append("Apply agricultural lime based on local soil-test guidance to correct acidity.")
    if payload.ph > 7.5:
        amendments.append("Add gypsum and organic matter to improve nutrient availability in alkaline soil.")
    if payload.organic_matter_percent is not None and payload.organic_matter_percent < 1.5:
        amendments.append("Add compost, farmyard manure, or green manure to improve organic matter.")
    if payload.moisture < 35:
        cautions.append("Irrigate before fertilizer application to reduce root stress and nutrient loss.")
    if not payload.irrigation_available:
        cautions.append("Prefer smaller split doses because irrigation is not reliably available.")
    if any(status == "excess" for status in statuses.values()):
        cautions.append("Avoid adding nutrients already marked as excess to prevent toxicity and runoff.")

    if not products:
        products.append(
            FertilizerProductRecommendation(
                product="Balanced compost or low-dose NPK blend",
                nutrient_focus="maintenance",
                application_rate_kg_per_acre=12,
                timing="Apply after routine field inspection.",
                method="Use light broadcast application and keep monitoring soil every 14-21 days.",
            )
        )

    plan = [
        "Confirm the recommendation with a recent soil test before large purchases.",
        "Apply fertilizer when rain is not expected immediately and wind is low.",
        "Keep a field record of product, dose, date, and crop response.",
    ]
    total_rate = sum(product.application_rate_kg_per_acre for product in products)
    confidence = 0.86 if crop_key in CROP_TARGETS and stage_key in STAGE_MULTIPLIERS else 0.74

    return FertilizerRecommendationResponse(
        crop=payload.crop,
        growth_stage=payload.growth_stage,
        nutrient_status=statuses,
        priority=_priority(statuses, payload.ph, payload.moisture),
        recommended_products=products,
        application_plan=plan,
        soil_amendments=amendments or ["No major soil amendment needed from the supplied values."],
        cautions=cautions or ["Follow local label dosage limits and avoid over-application."],
        estimated_total_kg=round(total_rate * payload.acreage, 2),
        confidence=confidence,
    )
