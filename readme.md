# 'Oli Ukulele Database

A database of the various 'Oli ukulele models.

## Tech Stack

Client side

- Javascript and CSS
- [List.js](https://listjs.com). Using [this fork](https://github.com/sqlpage/list.js) since main repo has a [search bug](https://github.com/javve/list.js/pull/721)
- [Papa Parse](https://www.papaparse.com/)

Data cleaning

- Python
- [Pandas](https://pandas.pydata.org)
- [Requests](https://requests.readthedocs.io/en/latest/)
- [Fire](https://github.com/google/python-fire)

## Commands

run python scripts

```bash
# download data from Youtube two Oli playlists, and searchers TUS channel for
# 'Oli videos not in playlists
python scripts/1_youtube_playlist.py download_yt_data

# create videos file
python scripts/1_youtube_playlist.py create_videos_file

# add data from YouTube to Oli.csv
python scripts/2_my_oli_file.py update_video_data

# add oli_id to Oli.csv
python scripts/2_my_oli_file.py add_oil_id

python scripts/3_create_app_data.py create_models_file

python scripts/3_create_app_data.py create_units_file
```

lint python scripts

```bash
ruff format scripts
```
## Start app

The code from the JavaScript client-side app is in `app`. To start the app, use Live Server on VS Code.

In `oli.code-workspace`, I have set the `liveServer.settings.root` to `app`, which means Live Server will use `app` as the root for the server. I set `liveServer.settings.file"` to `200.html`, because that is the file Surge.sh uses to handle [client side routing](https://surge.sh/help/adding-a-200-page-for-client-side-routing).

## Deploy app

I'm using [Surge.sh](https://surge.sh) to host the app. To deploy the app, use the following.

```bash
cd app
surge
``
