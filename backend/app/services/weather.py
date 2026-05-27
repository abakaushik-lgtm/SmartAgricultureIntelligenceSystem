from datetime import datetime, timedelta
import random


async def get_weather_forecast(location: str, days: int = 7) -> dict:
    forecast = []
    for index in range(days):
        temp = 24 + random.random() * 8
        rain = random.random() * 22
        forecast.append(
            {
                "date": (datetime.utcnow() + timedelta(days=index)).date().isoformat(),
                "temperature_c": round(temp, 1),
                "rainfall_mm": round(rain, 1),
                "humidity": round(55 + random.random() * 35),
                "rain_probability": round(min(0.95, rain / 25), 2),
            }
        )
    recommendations = [
        "Schedule irrigation after checking rainfall probability.",
        "Avoid pesticide spraying during high wind or rain windows.",
        "Use mulching when temperature exceeds crop comfort range.",
    ]
    return {"location": location, "forecast": forecast, "recommendations": recommendations}
