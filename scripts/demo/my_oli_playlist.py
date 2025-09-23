import requests
import time
import pandas as pd
import os, sys
from pathlib import Path
import fire
import json
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

import envar as envar

project_path = Path(__file__).parent.parent.parent
API_BASE = "https://www.googleapis.com/youtube/v3/"
OLI_PLAYLIST_ID = "PLWFY3fvmPdB143axUBIATCJ45lO-j_ju2"
playlist1_path = project_path / "raw_data" / "foo_playlist.csv"

def get_video_date(record):
    videoId = record["snippet"]["resourceId"]["videoId"]
    video_url = build_video_url(envar.API_KEY, videoId)

    try:
        res = requests.get(video_url)
    except:
        print(videoId)

    jsondata = res.json()
    video_record = jsondata["items"][0]
    date = video_record["snippet"]["publishedAt"]

    return date


def process_playlist_items(jsondata, playlist_id):
    records = []
    for item in jsondata["items"]:
        try:
            date = get_video_date(item)

            data = {
                "position": item["snippet"]["position"] + 1,
                "video_title": item["snippet"]["title"],
                "published_at": date,
                "video_id": item["snippet"]["resourceId"]["videoId"],
                "video_thumbnail": item["snippet"]["thumbnails"]["default"]["url"],
                "playlist_id": playlist_id,
                "video_provider": 'youtube'
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

def build_video_url(api_key, videoid):
    url = (
        API_BASE
        + f"videos?part=snippet&key={api_key}&id={videoid}"
    )
    return url



def download_oli_playlist(playlist_id, file_path):
    url = build_playlist_items_url(envar.API_KEY, playlist_id)
    print(url)
    res = requests.get(url)
    jsondata = res.json()

    records = process_playlist_items(jsondata, playlist_id)

    while "nextPageToken" in jsondata:
        time.sleep(1)
        new_url = url + f'&pageToken={jsondata['nextPageToken']}'
        print(new_url)
        res = requests.get(new_url)
        jsondata = res.json()
        new_records = process_playlist_items(jsondata, playlist_id)
        records += new_records

    df = pd.DataFrame(records)
    df.to_csv(file_path, index=False)



def download_yt_data():
    download_oli_playlist(OLI_PLAYLIST_ID, playlist1_path)

if __name__ == "__main__":
    fire.Fire(
        {
            "download_yt_data": download_yt_data,
        }
    )
