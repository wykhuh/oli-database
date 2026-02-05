import pandas as pd
from pathlib import Path
import fire

project_path = Path(__file__).parent.parent
my_oli_path = project_path / "raw_data" / "Oli.csv"
tonewood_path = project_path / "app" / "public" / "data" / "tonewoods.csv"

int_dtype = {"playlist_position": "Int64", "price": "Int64", "serial_number": "Int64"}


def format_models(record, field):
    values = list(record[field])
    values.sort(reverse=False)
    return ";".join(values)


def create_tonewood_csv():
    oli_df = pd.read_csv(my_oli_path, dtype=int_dtype)

    records = {}
    for i, row in oli_df.iterrows():
        if pd.isna(row["oli_id"]):
            continue

        id = row["top_wood"] + "|" + row["back_wood"]
        if id not in records:
            records[id] = {
                "soprano": set(),
                "concert": set(),
                "tenor": set(),
                "baritone": set(),
                "lattice": set(),
                "x": set(),
                "top_wood": row["top_wood"],
                "back_wood": row["back_wood"],
            }
        label = row["model"] + "|" + row["oli_id"]
        if row["size"] == "Soprano":
            records[id]["soprano"].add(label)
        elif row["size"] == "Concert":
            records[id]["concert"].add(label)
        elif row["size"] == "Tenor":
            records[id]["tenor"].add(label)
        elif row["size"] == "Baritone":
            records[id]["baritone"].add(label)

        if row["tier"] in ["L", "L1", "L2", "L3"]:
            records[id]["lattice"].add(label)
        else:
            records[id]["x"].add(label)

    rows = []
    for record in records.values():
        rows.append(
            {
                "Top Wood": record["top_wood"],
                "Back Wood": record["back_wood"],
                "Soprano": format_models(record, "soprano"),
                "Concert": format_models(record, "concert"),
                "Tenor": format_models(record, "tenor"),
                "Baritone": format_models(record, "baritone"),
                "Lattice": format_models(record, "lattice"),
                "X": format_models(record, "x"),
            }
        )

    df = pd.DataFrame(rows)
    df = df.sort_values(["Top Wood", "Back Wood"])
    df.to_csv(tonewood_path, index=False)


if __name__ == "__main__":
    fire.Fire({"update": create_tonewood_csv})
