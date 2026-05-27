from pathlib import Path
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer


def train(csv_path: str = "../datasets/sample_yield.csv", model_path: str = "yield_model.joblib") -> dict:
    data = pd.read_csv(csv_path)
    target = data.pop("yield_tons")
    categorical = ["crop", "region"]
    numeric = [column for column in data.columns if column not in categorical]
    preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("numeric", "passthrough", numeric),
        ]
    )
    pipeline = Pipeline([("preprocessor", preprocessor), ("model", RandomForestRegressor(n_estimators=200, random_state=42))])
    x_train, x_test, y_train, y_test = train_test_split(data, target, test_size=0.2, random_state=42)
    pipeline.fit(x_train, y_train)
    predictions = pipeline.predict(x_test)
    Path(model_path).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, model_path)
    return {
        "mae": mean_absolute_error(y_test, predictions),
        "rmse": mean_squared_error(y_test, predictions) ** 0.5,
        "r2": r2_score(y_test, predictions),
    }


if __name__ == "__main__":
    print(train())
