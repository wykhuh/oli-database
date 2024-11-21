import pandas as pd

df = pd.read_csv("./raw_data/oli-Oli.csv")


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


filter_df = df.drop_duplicates(subset=["size", "top wood", "back wood"]).copy()
filter_df = filter_df[["size", "top wood", "back wood"]]
filter_df = filter_df.sort_values(["size", "top wood", "back wood"])

filter_df = add_id(filter_df)
filter_df = filter_df[["id", "size", "top wood", "back wood"]]

filter_df.to_csv("./processed_data/tonewood_size.csv", index=False)


html = filter_df.to_html(index=False)
html = convert_bbcode(html)

text_file = open("./processed_data/tonewood_size.html", "w")
text_file.write(html)
text_file.close()


filter2_df = filter_df[["top wood", "back wood"]]
filter2_df = filter2_df.drop_duplicates()
filter2_df = filter2_df.sort_values(["top wood", "back wood"])

filter2_df = add_id(filter2_df)
filter2_df = filter2_df[["id", "top wood", "back wood"]]

filter2_df.to_csv("./processed_data/tonewood.csv", index=False)

html2 = filter2_df.to_html(index=False)
html2 = convert_bbcode(html2)

text_file = open("./processed_data/tonewood.html", "w")
text_file.write(html2)
text_file.close()
