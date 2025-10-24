import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import math
import envar as envar
from pathlib import Path
import fire
from datetime import datetime

project_path = Path(__file__).parent.parent
listings_path = project_path / "raw_data" / "oli_listings.csv"
OLI_URL = "https://theukulelesite.com/shop-by/brand/oli.html"


def fetch_content(url):
    print(url)
    page = requests.get(url)
    return BeautifulSoup(page.content, "html.parser")


def calculate_page_count(htmlContent):
    count_container = htmlContent.find("span", class_="toolbar-number")

    if count_container:
        count = int(count_container.text)
        return math.ceil(count / 24)
    else:
        return 0


# grab model and serial from title
def process_title(title):
    matches = re.findall("\\(.*?([LX][A-Za-z0-9- ]+)\\)", title)
    if matches[0]:
        parts = matches[0].split(" ")
        model = parts[0]
        serial_match = re.search("[0-9]+", parts[-1])
        serial_number = int(serial_match[0])

        return {"model": model, "serial_number": serial_number}


def current_datetime():
    current_dateTime = datetime.now()
    return current_dateTime.strftime("%Y-%m-%d %H:%M:%S")


def process_list_content(htmlContent):
    units = []

    now = current_datetime()

    items = htmlContent.find_all("div", class_="product-item-details")
    for item in items:
        link = item.find("a", class_="product-item-link")
        href = link["href"]
        title = link.text.strip()

        title_data = process_title(title)

        price_container = item.find("span", class_="price-wrapper")
        price = price_container["data-price-amount"]

        id_container = item.find("div", class_="price-final_price")
        product_id = id_container["data-product-id"]

        # details_content = fetch_content(href)
        # details_data = process_details_content(details_content)

        units.append(
            {
                "listing_title": title,
                "listing_url": href,
                "model": title_data["model"],
                "serial_number": title_data["serial_number"],
                "price": int(price),
                "date_added": now,
                "product_id": product_id,
                # "video_id": details_data['video_id']
            }
        )

    return units


def process_details_content(htmlContent):
    embed_container = htmlContent.find("div", class_="embed-container")
    iframe = embed_container.find("iframe")
    parts = iframe["src"].split("/")
    params = parts[-1].split("?")
    return {"video_id": params[0]}


def fetch_site_listings():
    html_countent = fetch_content(OLI_URL)

    units = []
    units = process_list_content(html_countent)

    page_count = calculate_page_count(html_countent)
    for count in range(page_count):
        if count == 0:
            continue

        page_url = f"{OLI_URL}?p={count + 1}"
        html_countent = fetch_content(page_url)
        units = units + process_list_content(html_countent)

    return units


# save oli listings as csv
def create_listing_csv():
    units = fetch_site_listings()

    df = pd.DataFrame(units)
    df.to_csv("../raw_data/oli_listings_3.csv", index=False)


# save oli listings so we can use them for developing script. Need to manually
# edit downloaded html.
def cache_listings():
    def write_content(url):
        page = requests.get(url)
        with open("../raw_data/draft/oli_listings.txt", "a") as f:
            f.write(page.text)

    write_content(OLI_URL)
    write_content(OLI_URL + "?p=2")
    write_content(OLI_URL + "?p=3")


# read cached listings
def read_cached_listings():
    with open("../raw_data/draft/oli_listings.txt", "r") as f:
        raw_text = f.read()
        return BeautifulSoup(raw_text, "html.parser")


def update_listings():
    site_listings = []
    # get current site listings
    site_listings = fetch_site_listings()

    site_serials = [listing["serial_number"] for listing in site_listings]
    print("site", len(site_serials))

    # get cached listings
    df = pd.read_csv(listings_path)
    cached_serials = df["serial_number"].unique()
    print("cache", len(cached_serials))

    # get new listings
    new_listings = [
        listing
        for listing in site_listings
        if listing["serial_number"] not in cached_serials
    ]
    print("new", len(new_listings))

    # add video_id
    for listing in new_listings:
        details_content = fetch_content(listing['listing_url'])
        details_data = process_details_content(details_content)
        listing["video_id"] = details_data['video_id']

    new_df = pd.DataFrame(new_listings)
    combined_df = pd.concat([df, new_df])
    print("combined_df", len(combined_df))

    temp = combined_df[
        (~combined_df["serial_number"].isin(site_serials))
        & (pd.isna(combined_df["date_sold"]))
    ]
    print("sold", len(temp["serial_number"]))

    # add date_sold
    now = current_datetime()
    combined_df.loc[
        (~combined_df["serial_number"].isin(site_serials))
        & (pd.isna(combined_df["date_sold"])),
        "date_sold",
    ] = now

    # combined_df['product_id'] = combined_df['product_id'].astype('Int64')


    combined_df.to_csv(listings_path, index=False)


def update():
    update_listings()

if __name__ == "__main__":
    fire.Fire(
        {
            # "create_listing_csv": create_listing_csv,
            # "cache_listings": cache_listings,
            # "update_listings": update_listings
            "update": update
        }
    )
