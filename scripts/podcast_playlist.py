import requests
import time
import pandas as pd
import envar as envar
from pathlib import Path
import fire

project_path = Path(__file__).parent.parent
API_BASE = "https://www.googleapis.com/youtube/v3/"
PODCAST_ID = "PL6nYkmn-q9zOKISE6GcxcseLFvny9K4Jz"

playlist_path = project_path / "raw_data" / "tus_podcast.csv"


def process_playlist_items(json, playlist_id):
    records = []
    for item in json["items"]:
        print(item)
        break
        try:
            date = get_video_date(item)
            data = {
                "position": item["snippet"]["position"] + 1,
                "video_title": item["snippet"]["title"],
                "published_at": date,
                "video_id": item["snippet"]["resourceId"]["videoId"],
                "video_thumbnail": item["snippet"]["thumbnails"]["default"]["url"],
                "description": item["snippet"]["description"],
            }
            records.append(data)
        except:
            print("invalid date", item["snippet"])

    return records


def build_playlist_items_url(api_key, playlistId, limit=50):
    url = (
        API_BASE
        + f"playlistItems?part=snippet&key={api_key}&playlistId={playlistId}&maxResults={limit}"
    )
    return url


def build_video_url(api_key, videoid):
    url = API_BASE + f"videos?part=snippet&key={api_key}&id={videoid}"
    return url


def get_video_date(record):
    videoId = record["snippet"]["resourceId"]["videoId"]
    video_url = build_video_url(envar.API_KEY, videoId)

    try:
        res = requests.get(video_url)
    except:
        print("invalid videoId:", videoId)

    jsondata = res.json()
    video_record = jsondata["items"][0]
    date = video_record["snippet"]["publishedAt"]

    return date


def download_playlist(playlist_id, file_path):
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
    df.to_csv(file_path, index=False)


def download_yt_data():
    download_playlist(PODCAST_ID, playlist_path)


def get_video_for_id():
    videoId = "s1aW6ipuXxM"
    video_url = build_video_url(envar.API_KEY, videoId)

    try:
        res = requests.get(video_url)
    except:
        print("invalid videoId:", videoId)

    jsondata = res.json()
    video_record = jsondata["items"][0]
    print(video_record)


if __name__ == "__main__":
    fire.Fire(
        {
            # "get_video_for_id":get_video_for_id,
            "download_yt_data": download_yt_data,
        }
    )
