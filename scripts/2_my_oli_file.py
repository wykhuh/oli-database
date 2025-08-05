import pandas as pd
import envar as envar
from pathlib import Path
import hashlib

project_path = Path(__file__).parent.parent
oli_path = project_path / "raw_data" / "Oli.csv"
video_path = project_path / "processed_data" / "videos_list.csv"
int_dtype = {"playlist_position": "Int64", "price": "Int64", "serial_number": "Int64"}


def update_video_data():
    oli_df = pd.read_csv(oli_path, dtype=int_dtype)

    cols = ["position", "video_title", "video_id", "playlist_id", "published_at"]
    videos_df = pd.read_csv(video_path, usecols=cols)

    # look for rows that have video_id, but do not have video_title
    temp_df = oli_df[pd.isna(oli_df["video_title"]) & pd.notna(oli_df["video_id"])]
    ids = temp_df["video_id"].unique()

    for i, row in videos_df.iterrows():
        video_id = row["video_id"]
        if video_id not in ids:
            continue

        oli_df.loc[oli_df["video_id"] == video_id, "playlist_position"] = row[
            "position"
        ]
        oli_df.loc[oli_df["video_id"] == video_id, "video_title"] = row["video_title"]
        oli_df.loc[oli_df["video_id"] == video_id, "playlist_id"] = row["playlist_id"]
        oli_df.loc[oli_df["video_id"] == video_id, "video_type"] = "sound_sample"
        oli_df.loc[oli_df["video_id"] == video_id, "video_provider"] = "youtube"

    oli_df.to_csv(oli_path, index=False)


def add_oil_id():
    my_oli_df = pd.read_csv(oli_path, dtype=int_dtype)
    my_oli_df["oli_id"] = ""

    for i, row in my_oli_df.iterrows():
        if pd.isna(row["model"]):
            continue

        # temp = row["model"] + row["top_wood"] + row["back_wood"]
        # my_oli_df.loc[i, "oli_id"] = hashlib.md5(temp.encode()).hexdigest()
        my_oli_df.loc[i, "oli_id"] = row["model"].replace(' ','')

    my_oli_df.to_csv(oli_path, index=False)


# update_video_data()
add_oil_id()
