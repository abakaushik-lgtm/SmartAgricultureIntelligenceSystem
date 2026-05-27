from ultralytics import YOLO


def evaluate(weights_path: str = "runs/plant-disease/weights/best.pt", data_yaml: str = "datasets/yolo-plant-disease/data.yaml") -> dict:
    metrics = YOLO(weights_path).val(data=data_yaml)
    return {
        "map50": float(metrics.box.map50),
        "map50_95": float(metrics.box.map),
        "precision": float(metrics.box.mp),
        "recall": float(metrics.box.mr),
    }


if __name__ == "__main__":
    print(evaluate())
