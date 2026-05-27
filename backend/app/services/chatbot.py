from app.schemas.agriculture import ChatRequest, ChatResponse


async def answer_agriculture_question(payload: ChatRequest) -> ChatResponse:
    answer = (
        "Based on the crop context, prioritize soil moisture monitoring, balanced NPK application, "
        "field scouting twice a week, and weather-aware irrigation. For exact chemical dosage, follow "
        "your local agricultural extension label guidance."
    )
    if payload.language != "en":
        answer = f"[{payload.language}] {answer}"
    return ChatResponse(answer=answer, sources=["AgriNexus agronomy rules", "Local weather and soil context"])
