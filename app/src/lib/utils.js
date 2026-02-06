export function cleanData(data) {
  return (
    data
      // filter out blank rows where all fields are empty
      .filter((item) => Object.values(item).some((v) => v !== ""))
      // convert to date
      .map((item) => {
        let date = new Date(item["Video Published At"]);
        return { ...item, "Video Published At": date };
      })
  );
}

export function pluralize(number, text, useComma = false) {
  if (number === undefined) number = 0;
  let displayNumber = useComma ? number.toLocaleString() : number;
  if (number === 1) {
    return `${displayNumber} ${text}`;
  } else {
    return `${displayNumber} ${text}s`;
  }
}

export function updateURL(event) {
  let searchterm = event.detail.value;
  if (searchterm.length > 0) {
    const url = new URL(window.location);
    url.searchParams.set("q", searchterm);
    history.pushState({}, "", url);
  } else {
    const url = new URL(window.location);
    url.search = "";
    history.pushState({}, "", url);
  }
}

export function formatVideoList(units, id) {
  let uniqueIds = new Set();

  return (
    units
      // get units that match params id
      .filter((unit) => id.split(",").includes(unit["Oli Id"]))
      // get units with unique video
      .filter((unit) => {
        if (uniqueIds.has(unit["Video Id"])) {
          return false;
        } else {
          uniqueIds.add(unit["Video Id"]);
          return true;
        }
      })
  );
}
