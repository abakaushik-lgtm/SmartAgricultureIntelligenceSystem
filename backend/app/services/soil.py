from app.schemas.agriculture import SoilAnalysisRequest, SoilAnalysisResponse


def analyze_soil(payload: SoilAnalysisRequest) -> SoilAnalysisResponse:
    nutrient_score = min(100, (payload.nitrogen + payload.phosphorus + payload.potassium) / 6)
    ph_score = max(0, 100 - abs(payload.ph - 6.7) * 20)
    moisture_score = max(0, 100 - abs(payload.moisture - 55) * 1.3)
    health_score = round(nutrient_score * 0.45 + ph_score * 0.3 + moisture_score * 0.25)

    amendments: list[str] = []
    if payload.nitrogen < 60:
        amendments.append("Apply nitrogen-rich organic compost or urea in split doses.")
    if payload.phosphorus < 45:
        amendments.append("Add rock phosphate or DAP before irrigation.")
    if payload.potassium < 45:
        amendments.append("Use potash-based fertilizer to improve stress tolerance.")
    if payload.ph < 6:
        amendments.append("Apply agricultural lime to reduce soil acidity.")
    if payload.ph > 7.5:
        amendments.append("Use gypsum and organic matter to improve alkaline soil.")
    if payload.moisture < 35:
        amendments.append("Increase irrigation frequency and add mulch.")

    status = "excellent" if health_score >= 80 else "moderate" if health_score >= 55 else "critical"
    recommendation = "Maintain current nutrient plan." if not amendments else " ".join(amendments[:2])
    return SoilAnalysisResponse(
        health_score=health_score,
        status=status,
        fertilizer_recommendation=recommendation,
        amendments=amendments or ["Continue balanced NPK and monitor every 14 days."],
    )
