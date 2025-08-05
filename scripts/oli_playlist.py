import requests
import time
import pandas as pd
import envar as envar
from pathlib import Path

project_path = Path(__file__).parent.parent
API_BASE = "https://www.googleapis.com/youtube/v3/"
# OLI_PLAYLIST_ID has 300+ videos
OLI_PLAYLIST_ID = "PLEQbDXy0ShuWQ4iKD4YVC1iOj3uKY1R-2"
# OLI_PLAYLIST_2_ID has some old videos that were not added to OLI_PLAYLIST_ID
OLI_PLAYLIST_2_ID = "PLEQbDXy0ShuW7JotVhROvR4TxhmO_0tLD"
TUS_CLIPS_ID = "UCEg5r7VYluy43shJKpKGeVg"


def process_playlist_items(json, playlist_id):
    records = []
    for item in json["items"]:
        try:
            data = {
                "position": item["snippet"]["position"] + 1,
                "video_title": item["snippet"]["title"],
                "published_at": item["snippet"]["publishedAt"],
                "video_id": item["snippet"]["resourceId"]["videoId"],
                "video_thumbnail": item["snippet"]["thumbnails"]["default"]["url"],
                "playlist_id": playlist_id,
            }
            records.append(data)
        except:
            print(item["snippet"])

    return records


def process_search_items(json, ids):
    records = []
    if "items" not in json:
        print(json)
        return []

    for item in json["items"]:
        if "videoId" not in item["id"]:
            continue
        if item["id"]["videoId"] in ids:
            continue

        try:
            data = {
                "video_title": item["snippet"]["title"],
                "published_at": item["snippet"]["publishedAt"],
                "video_id": item["id"]["videoId"],
                "video_thumbnail": item["snippet"]["thumbnails"]["default"]["url"],
            }
            records.append(data)
        except:
            print(item["snippet"])

    return records


def build_playlist_items_url(api_key, playlistId, limit=50):
    url = (
        API_BASE
        + f"playlistItems?part=snippet&key={api_key}&playlistId={playlistId}&maxResults={limit}"
    )
    return url


def build_search_channel_url(api_key, channelId, keyword, limit=50):
    url = (
        API_BASE
        + f"search?part=snippet&type=video&key={api_key}&channelId={channelId}&q={keyword}&maxResults={limit}"
    )
    return url


def download_oli_playlist(playlist_id, file_name):
    url = build_playlist_items_url(envar.API_KEY, playlist_id)
    print(url)
    res = requests.get(url)
    json = res.json()
    records = process_playlist_items(json, playlist_id)

    while "nextPageToken" in json:
        time.sleep(1)
        new_url = url + f'&pageToken={json['nextPageToken']}'
        print(new_url)
        res = requests.get(new_url)
        json = res.json()
        new_records = process_playlist_items(json, playlist_id)
        records += new_records

    df = pd.DataFrame(records)
    df.to_csv(project_path / "raw_data" / file_name, index=False)


# look for 'Oli videos not included in the playlists
def find_missing_videos():
    oli_playlist_df = pd.read_csv(project_path / "raw_data" / "oli_playlist.csv")
    oli_playlist_2_df = pd.read_csv(project_path / "raw_data" / "oli_playlist_2.csv")
    ids = list(oli_playlist_df["video_id"]) + list(oli_playlist_2_df["video_id"])

    url = build_search_channel_url(envar.API_KEY, TUS_CLIPS_ID, "oli")
    print(url)
    res = requests.get(url)
    json = res.json()
    records = process_search_items(json, ids)

    while "nextPageToken" in json:
        time.sleep(2)
        new_url = url + f'&pageToken={json['nextPageToken']}'
        print(new_url)
        res = requests.get(new_url)
        json = res.json()
        new_records = process_search_items(json, ids)
        records += new_records

    df = pd.DataFrame(records)
    df = df.sort_values(["published_at", "video_id"])
    df.to_csv(project_path / "raw_data" / "missing_videos.csv", index=False)


# clean up values in missing videos csv
def update_missing_videos():
    missing_df = pd.read_csv("../raw_data/missing_videos.csv")
    missing_df["video_title"] = missing_df["video_title"].replace(
        {"&#39;": "'", "&quot;": '"', "&amp;": "&"}, regex=True
    )

    missing_df["position"] = -9999
    missing_df["playlist_id"] = ""

    missing_df = missing_df[missing_df["video_title"].str.contains("Oli")]

    missing_df = missing_df[
        [
            "position",
            "video_title",
            "published_at",
            "video_id",
            "video_thumbnail",
            "playlist_id",
        ]
    ]

    missing_df = missing_df.sort_values(["published_at", "video_id"])

    missing_df = missing_df.drop_duplicates()

    missing_df.to_csv("../processed_data/missing_videos_fixed.csv", index=False)


# download_oli_playlist(OLI_PLAYLIST_ID, 'oli_playlist.csv')
# download_oli_playlist(OLI_PLAYLIST_2_ID, 'oli_playlist_2.csv')

# find_missing_videos()
# update_missing_videos()
