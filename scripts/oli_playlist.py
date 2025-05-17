import requests
import time
import pandas as pd
import envar
from pathlib import Path

project_path = Path(__file__).parent.parent
API_BASE = "https://www.googleapis.com/youtube/v3/"
OLI_PLAYLIST_ID = "PLEQbDXy0ShuWQ4iKD4YVC1iOj3uKY1R-2"
HOZEN_PLAYLIST_ID = "PLEQbDXy0ShuVdsIsemizW3b2PxwIB56QH"


def process_json_response(json):
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


def build_playlist_items_url(playlistId, api_key, limit=50):
    url = (
        API_BASE
        + f"playlistItems?part=snippet&key={api_key}&playlistId={playlistId}&maxResults={limit}"
    )
    return url


url = build_playlist_items_url(OLI_PLAYLIST_ID, envar.API_KEY)
print(url)
res = requests.get(url)
json = res.json()
records = process_json_response(json)

while "nextPageToken" in json:
    time.sleep(1)
    new_url = url + f'&pageToken={json['nextPageToken']}'
    print(new_url)
    res = requests.get(new_url)
    json = res.json()
    new_records = process_json_response(json)
    records += new_records


df = pd.DataFrame(records)
df.to_csv(project_path/"raw_data"/"oli_playlist.csv", index=False)
