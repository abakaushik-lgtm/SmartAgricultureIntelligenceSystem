from pathlib import Path
import shutil


def prepare_yolo_dataset(raw_dir: str, output_dir: str) -> None:
    raw = Path(raw_dir)
    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)
    for split in ["train", "val", "test"]:
        (output / split / "images").mkdir(parents=True, exist_ok=True)
        (output / split / "labels").mkdir(parents=True, exist_ok=True)
    for image in raw.rglob("*.jpg"):
        target = output / "train" / "images" / image.name
        shutil.copy2(image, target)


if __name__ == "__main__":
    prepare_yolo_dataset("datasets/raw-plant-leaves", "datasets/yolo-plant-disease")
