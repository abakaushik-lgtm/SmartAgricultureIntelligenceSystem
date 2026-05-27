from app.schemas.agriculture import FertilizerRecommendationRequest
from app.services.fertilizer import recommend_fertilizer


def test_recommend_fertilizer_prioritizes_nutrient_deficits():
    payload = FertilizerRecommendationRequest(
        crop="maize",
        growth_stage="vegetative",
        acreage=2,
        nitrogen=35,
        phosphorus=20,
        potassium=25,
        ph=6.4,
        moisture=48,
        organic_matter_percent=1.2,
    )

    result = recommend_fertilizer(payload)

    assert result.priority == "high"
    assert result.nutrient_status["nitrogen"] == "severe_deficit"
    assert result.estimated_total_kg > 0
    assert any(product.nutrient_focus == "nitrogen" for product in result.recommended_products)
    assert any("organic matter" in amendment.lower() for amendment in result.soil_amendments)


def test_recommend_fertilizer_uses_maintenance_plan_for_balanced_soil():
    payload = FertilizerRecommendationRequest(
        crop="wheat",
        growth_stage="vegetative",
        acreage=1,
        nitrogen=95,
        phosphorus=45,
        potassium=38,
        ph=6.8,
        moisture=55,
        organic_matter_percent=2.5,
    )

    result = recommend_fertilizer(payload)

    assert result.priority == "low"
    assert result.recommended_products[0].nutrient_focus == "maintenance"
    assert result.confidence == 0.86
