import pandas as pd
from pathlib import Path

project_path = Path(__file__).parent.parent


def add_id(df):
    df = df.reset_index(drop=True)
    df["id"] = df.index + 1
    return df


def convert_bbcode(html):
    return (
        html.replace(' border="1" class="dataframe"', "")
        .replace(' style="text-align: right;"', "")
        .replace("<thead>", "")
        .replace("</thead>", "")
        .replace("<tbody>", "")
        .replace("</tbody>", "")
        .replace("<", "[")
        .replace(">", "]")
    )


def create_files():
    df = pd.read_csv(project_path / "raw_data" / "Oli.csv")

    filter_df = df.drop_duplicates(subset=["size", "top wood", "back wood"]).copy()
    filter_df = filter_df[["size", "top wood", "back wood"]]
    filter_df = filter_df.sort_values(["size", "top wood", "back wood"])

    filter_df = add_id(filter_df)
    filter_df = filter_df[["id", "size", "top wood", "back wood"]]
    filter_df = filter_df.dropna(subset=["top wood", "back wood"])

    filter_df.to_csv(project_path / "processed_data" / "tonewood_size.csv", index=False)

    html = filter_df.to_html(index=False)
    bbcode = convert_bbcode(html)

    text_file = open(project_path / "processed_data" / "tonewood_size.txt", "w")
    text_file.write(bbcode)
    text_file.close()

    filter2_df = filter_df[["top wood", "back wood"]]
    filter2_df = filter2_df.drop_duplicates()
    filter2_df = filter2_df.sort_values(["top wood", "back wood"])

    filter2_df = add_id(filter2_df)
    filter2_df = filter2_df[["id", "top wood", "back wood"]]
    filter2_df = filter2_df.dropna(subset=["top wood", "back wood"])

    filter2_df.to_csv(project_path / "processed_data" / "tonewood.csv", index=False)

    html2 = filter2_df.to_html(index=False)
    bbcode2 = convert_bbcode(html2)

    text_file = open(project_path / "processed_data" / "tonewood.txt", "w")
    text_file.write(bbcode2)
    text_file.close()


def create_tenor_tonewoods():
    df = pd.read_csv(project_path / "raw_data" / "Oli.csv")
    df.loc[df["tier"].isin(["L", "L1", "L2", "L3"]), "bracing"] = "Lattice"
    df.loc[df["tier"].isin(["X", "X1", "X2", "X3"]), "bracing"] = "X"

    cols = ["bracing", "top_wood", "back_wood", "finish"]
    filter_df = df.dropna(subset=["top_wood", "back_wood"]).copy()

    filter_df = filter_df.sort_values("video_published_at")
    filter_df = filter_df[filter_df["size"] == "Tenor"]
    filter_df = filter_df[~pd.isna(filter_df["playlist_position"])]
    filter_df = filter_df[filter_df["video_type"] == "sound_sample"]

    filter_df = filter_df.drop_duplicates(subset=cols, keep="last")
    filter_df = filter_df[cols + ["video_id"]]
    filter_df["video_url"] = (
        '[URL="https://www.youtube.com/watch?v='
        + filter_df["video_id"]
        + '"]YouTube[/URL]'
    )
    del filter_df["video_id"]

    filter_df = filter_df.sort_values(cols)

    filter_df.to_csv(
        project_path / "processed_data" / "tenor_tonewood.csv", index=False
    )

    html = filter_df.to_html(index=False)
    bbcode = convert_bbcode(html)

    text_file = open(project_path / "processed_data" / "tenor_tonewood.txt", "w")
    text_file.write(bbcode)
    text_file.close()


create_tenor_tonewoods()


def create_tenor_standard_tonewoods():
    df = pd.read_csv(project_path / "raw_data" / "Oli.csv")

    cols = ["tier", "top_wood", "back_wood"]
    filter_df = df.dropna(subset=["top_wood", "back_wood"]).copy()

    filter_df = filter_df.sort_values("video_published_at")
    filter_df = filter_df[filter_df["size"] == "Tenor"]
    filter_df = filter_df[~pd.isna(filter_df["playlist_position"])]
    filter_df = filter_df[filter_df["video_type"] == "sound_sample"]
    filter_df = filter_df[pd.isna(filter_df["limited_edition"])]

    filter_df = filter_df.drop_duplicates(subset=cols, keep="last")
    filter_df = filter_df[cols + ["video_id"]]
    filter_df["video_url"] = (
        '[URL="https://www.youtube.com/watch?v='
        + filter_df["video_id"]
        + '"]YouTube[/URL]'
    )
    del filter_df["video_id"]

    filter_df = filter_df.sort_values(cols)

    filter_df.to_csv(
        project_path / "processed_data" / "tenor_standard_tonewood.csv", index=False
    )


# create_tenor_tonewoods()

create_tenor_standard_tonewoods()
