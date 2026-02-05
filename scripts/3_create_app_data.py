from pathlib import Path

import fire
import pandas as pd

project_path = Path(__file__).parent.parent
playlist1_path = project_path / "raw_data" / "oli_playlist.csv"
playlist2_path = project_path / "raw_data" / "oli_playlist_2.csv"
my_oli_path = project_path / "raw_data" / "Oli.csv"

missing_path = project_path / "processed_data" / "missing_videos_fixed.csv"
videos_path = project_path / "processed_data" / "videos_list.csv"
models_path = project_path / "app" / "public" / "data" / "models_list.csv"
units_path = project_path / "app" / "public" / "data" / "units_list.csv"

int_dtype = {"playlist_position": "Int64", "price": "Int64", "serial_number": "Int64"}


def create_models_file():
    cols = [
        "model",
        "tier",
        "type",
        "size",
        "top_wood",
        "back_wood",
        "finish",
        "limited_edition",
        "model_notes",
        "oli_id",
        "video_published_at",
        "video_type",
    ]
    my_oli_df = pd.read_csv(my_oli_path, usecols=cols, dtype=int_dtype)
    # convert to date
    my_oli_df["video_published_at"] = pd.to_datetime(my_oli_df["video_published_at"])
    my_oli_df = my_oli_df.sort_values(by=["video_published_at"], ascending=True)

    models_df = my_oli_df[my_oli_df["video_type"] == "sound_sample"]
    models_df = models_df.drop("video_type", axis=1)
    models_df = models_df.dropna(subset=["model"])
    models_df = models_df.drop_duplicates(
        subset=["oli_id", "top_wood", "back_wood", "model_notes"], keep="first"
    )

    models_df = models_df.sort_values(by=["video_published_at"])

    # update column names
    models_df.columns = [name.replace("_", " ").title() for name in models_df.columns]

    print("models_df", models_df.shape)
    models_df.to_csv(models_path, index=False)


def create_units_file():
    cols = [
        "top_wood",
        "back_wood",
        "limited_edition",
        "model_notes",
        "notes",
        "oli_id",
        "video_title",
        "video_id",
        "video_provider",
        "video_type",
        "video_published_at",
        "price",
        "serial_number",
        "listing_title",
        "listing_url",
        "model",
    ]

    my_oli_df = pd.read_csv(my_oli_path, usecols=cols, dtype=int_dtype)
    # convert to date
    my_oli_df["video_published_at"] = pd.to_datetime(my_oli_df["video_published_at"])
    my_oli_df = my_oli_df.sort_values(by=["video_published_at"], ascending=True)

    units_df = my_oli_df[my_oli_df["video_type"] == "sound_sample"]
    units_df = units_df.drop("video_type", axis=1)
    units_df = units_df.dropna(subset=["oli_id"])

    units_df = units_df.sort_values(by=["video_published_at"])

    # update column names
    units_df.columns = [name.replace("_", " ").title() for name in units_df.columns]

    print("units_df", units_df.shape)
    units_df.to_csv(units_path, index=False)


def update():
    create_models_file()
    create_units_file()


if __name__ == "__main__":
    fire.Fire(
        {
            # "create_models_file": create_models_file,
            # "create_units_file": create_units_file,
            "update": update
        }
    )
