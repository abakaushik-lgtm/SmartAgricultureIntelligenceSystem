from ultralytics import YOLO


def train(data_yaml: str = "datasets/yolo-plant-disease/data.yaml", epochs: int = 50) -> None:
    model = YOLO("yolov8n.pt")
    model.train(data=data_yaml, epochs=epochs, imgsz=640, project="runs", name="plant-disease")


if __name__ == "__main__":
    train()
