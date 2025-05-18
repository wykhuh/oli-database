import requests
import time
import pandas as pd
import envar as envar
from pathlib import Path

project_path = Path(__file__).parent.parent
API_BASE = "https://www.googleapis.com/youtube/v3/"
OLI_PLAYLIST_ID = "PLEQbDXy0ShuWQ4iKD4YVC1iOj3uKY1R-2"
HOZEN_PLAYLIST_ID = "PLEQbDXy0ShuVdsIsemizW3b2PxwIB56QH"
TUS_CLIPS_ID = 'UCEg5r7VYluy43shJKpKGeVg'


def process_playlist_items(json):
    records = []
    for item in json["items"]:
        try:
            data = {
                "position": item["snippet"]["position"] + 1,
                "title": item["snippet"]["title"],
                "published_at": item["snippet"]["publishedAt"],
                "video_id": item["snippet"]["resourceId"]["videoId"],
                "video_thumbnail": item["snippet"]["thumbnails"]["default"]["url"],
            }
            records.append(data)
        except:
            print(item["snippet"])

    return records

def process_search_items(json, ids):
    records = []
    if 'items' not in json:
        print(json)
        return []

    for item in json["items"]:
        if 'videoId' not in item['id']:
            continue
        if item['id']['videoId'] in ids:
            continue

        try:
            data = {
                "title": item["snippet"]["title"],
                "published_at": item["snippet"]["publishedAt"],
                "video_id": item["id"]["videoId"],
                "video_thumbnail": item["snippet"]["thumbnails"]["default"]["url"],
            }
            records.append(data)
        except:
            print(item['snippet'])


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


def download_oli_playlist():
    url = build_playlist_items_url(envar.API_KEY, OLI_PLAYLIST_ID)
    print(url)
    res = requests.get(url)
    json = res.json()
    records = process_playlist_items(json)

    while "nextPageToken" in json:
        time.sleep(1)
        new_url = url + f'&pageToken={json['nextPageToken']}'
        print(new_url)
        res = requests.get(new_url)
        json = res.json()
        new_records = process_playlist_items(json)
        records += new_records


    df = pd.DataFrame(records)
    df.to_csv(project_path/"raw_data"/"oli_playlist.csv", index=False)


def find_missing_videos():
    oli_playlist_df = pd.read_csv(project_path/"raw_data"/"oli_playlist.csv")
    ids = oli_playlist_df['video_id'].unique()

    url = build_search_channel_url(envar.API_KEY, TUS_CLIPS_ID, 'oli')
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
    df.to_csv(project_path/"raw_data"/"missing_videos.csv", index=False)

# download_oli_playlist()

# find_missing_videos()
