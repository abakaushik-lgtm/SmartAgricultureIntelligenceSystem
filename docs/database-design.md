# MongoDB Collections

## users
Stores farmer, admin, and agronomist accounts.

Fields: `name`, `email`, `password_hash`, `firebase_uid`, `role`, `region`, `preferred_language`, `is_active`, timestamps.

## crops
Stores farm crop inventory.

Fields: `user_id`, `name`, `variety`, `region`, `acreage`, `planting_date`, timestamps.

## predictions
Stores yield and other ML predictions.

Fields: `user_id`, `crop`, `prediction_type`, `inputs`, `output`, timestamps.

## weather_data
Stores normalized weather snapshots and recommendations.

Fields: `location`, `raw_payload`, `recommendations`, timestamps.

## soil_reports
Stores soil inputs and fertilizer recommendations.

Fields: `user_id`, `crop`, `parameters`, `health_score`, `recommendation`, timestamps.

## disease_reports
Stores disease detection outputs.

Fields: `user_id`, `crop`, `image_url`, `disease`, `confidence`, `treatment`, timestamps.

## chat_history
Stores AI assistant conversations.

Fields: `user_id`, `message`, `answer`, `language`, timestamps.
