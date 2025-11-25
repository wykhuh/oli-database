import pandas as pd
import envar as envar
from pathlib import Path
import hashlib
import fire

project_path = Path(__file__).parent.parent
oli_path = project_path / "raw_data" / "Oli.csv"
video_path = project_path / "processed_data" / "videos_list.csv"
int_dtype = {"playlist_position": "Int64", "price": "Int64",
             "serial_number": "Int64", "product_id": "Int64"}
listings_path = project_path / "raw_data" / "oli_listings.csv"


# uses youtube video id to fill in the rest of the video information
# (title, date, playlist position, etc)
def update_video_data():
    oli_df = pd.read_csv(oli_path, dtype=int_dtype)

    cols = [
        "position",
        "video_title",
        "video_id",
        "video_provider",
        "playlist_id",
        "published_at",
    ]
    videos_df = pd.read_csv(video_path, usecols=cols)

    ids = oli_df["video_id"].unique()

    # add video data for videos whose video_id are not in Oli.csv
    for i, row in videos_df.iterrows():
        if row["video_id"] in ids:
            continue

        # add row to my_oli_df
        row = row.rename(
            {"position": "playlist_position", "published_at": "video_published_at"}
        )
        oli_df = pd.concat([oli_df, pd.DataFrame(row).transpose()])

    # look for rows that have video_id, but do not have video_title
    temp_df = oli_df[pd.isna(oli_df["video_title"]) & pd.notna(oli_df["video_id"])]
    ids = temp_df["video_id"].unique()

    # add video data for videos that only have video_id in Oli.csv
    for i, row in videos_df.iterrows():
        video_id = row["video_id"]
        if video_id not in ids:
            continue

        foo = pd.isna(oli_df["video_title"]) & (oli_df["video_id"] == video_id)
        oli_df.loc[foo, "playlist_position"] = row["position"]
        oli_df.loc[foo, "video_title"] = row["video_title"]
        oli_df.loc[foo, "playlist_id"] = row["playlist_id"]
        oli_df.loc[foo, "video_type"] = "sound_sample"
        oli_df.loc[foo, "video_provider"] = "youtube"
        oli_df.loc[foo, "video_published_at"] = row["published_at"]

    oli_df.to_csv(oli_path, index=False)


def add_listings():
    listings_df = pd.read_csv(listings_path, dtype=int_dtype, skipinitialspace=True)
    oli_df = pd.read_csv(oli_path, dtype=int_dtype)

    new_serials = set(listings_df['serial_number']) - set(oli_df['serial_number'])
    print(len(new_serials))

    new_listings_df = listings_df[listings_df['serial_number'].isin(new_serials)]
    combine_df = pd.concat([oli_df, new_listings_df])

    del combine_df['date_added']
    del combine_df['date_sold']

    combine_df.to_csv(oli_path, index=False)





def fix_date():
    oli_df = pd.read_csv(oli_path, dtype=int_dtype)

    cols = ["video_id", "published_at"]
    videos_df = pd.read_csv(video_path, usecols=cols)

    ids = oli_df["video_id"].unique()

    # add video data for videos that only have video_id in Oli.csv
    for i, row in videos_df.iterrows():
        video_id = row["video_id"]

        oli_df.loc[oli_df["video_id"] == video_id, "video_published_at"] = row[
            "published_at"
        ]

    oli_df.to_csv(oli_path, index=False)


def add_oil_id():
    my_oli_df = pd.read_csv(oli_path, dtype=int_dtype, skipinitialspace=True)
    my_oli_df["oli_id"] = ""

    for i, row in my_oli_df.iterrows():
        if pd.isna(row["model"]):
            continue

        # use md5 to create id
        # temp = row["model"] + row["top_wood"] + row["back_wood"]
        # my_oli_df.loc[i, "oli_id"] = hashlib.md5(temp.encode()).hexdigest()

        # use model name to create id
        my_oli_df.loc[i, "oli_id"] = row["tier"] + "-" + row["type"]

    my_oli_df.to_csv(oli_path, index=False)


def add_new_label():
    my_oli_df = pd.read_csv(oli_path, dtype=int_dtype, skipinitialspace=True)
    my_oli_df["new"] = ""

    ids = set()
    for i, row in my_oli_df.iterrows():
        if row["model"] not in ids:
            ids.add(row["model"])
            my_oli_df.loc[i, "new"] = True

    my_oli_df.to_csv(oli_path, index=False)

def strip_whitespace():
    my_oli_df = pd.read_csv(oli_path, dtype=int_dtype)
    for col in my_oli_df.columns:
        if my_oli_df[col].dtype == 'object' and col not in ['new','limited_edition']:
            my_oli_df[col] = my_oli_df[col].str.strip()
        else:
            my_oli_df[col] = my_oli_df[col]

    my_oli_df.to_csv(oli_path, index=False)

def copy_my_data():
    oli_df = pd.read_csv(oli_path, dtype=int_dtype)
    playlist_positions = set(oli_df[oli_df['tier'].isna() & oli_df['listing_title'].notna()]['playlist_position'])
    playlist_positions.remove(-9999)
    playlist_positions.remove(pd.NA)

    done_df = oli_df[(oli_df['playlist_position'].isin(playlist_positions)) &
                 oli_df['tier'].notna()]

    for i, row in done_df.iterrows():
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'type'] = row['type']
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'size'] = row['size']
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'top_wood'] = row['top_wood']
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'back_wood'] = row['back_wood']
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'finish'] = row['finish']
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'model_notes'] = row['model_notes']
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'limited_edition'] = row['limited_edition']
        oli_df.loc[(oli_df['playlist_position'] == row['playlist_position']) & (oli_df['tier'].isna()), 'tier'] = row['tier']

    oli_df.to_csv(oli_path, index = False)

def update():
    strip_whitespace()
    add_oil_id()
    add_new_label()



if __name__ == "__main__":
    fire.Fire(
        {
            "add_listings": add_listings,
            "update_video_data": update_video_data,
            "copy_my_data": copy_my_data,
            # "add_oil_id": add_oil_id,
            # "add_new_label": add_new_label,
            "update": update
            # "fix_date":fix_date
        }
    )
