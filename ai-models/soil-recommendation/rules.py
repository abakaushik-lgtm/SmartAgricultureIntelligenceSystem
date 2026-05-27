def recommend_fertilizer(nitrogen: float, phosphorus: float, potassium: float, ph: float, crop: str) -> dict:
    recommendations = []
    if nitrogen < 60:
        recommendations.append("Increase nitrogen with compost, urea, or green manure.")
    if phosphorus < 45:
        recommendations.append("Use DAP or rock phosphate before sowing.")
    if potassium < 45:
        recommendations.append("Apply muriate of potash in split doses.")
    if ph < 6:
        recommendations.append("Apply agricultural lime.")
    if ph > 7.5:
        recommendations.append("Add gypsum and organic matter.")
    return {"crop": crop, "recommendations": recommendations or ["Maintain current balanced fertility program."]}
