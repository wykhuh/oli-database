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
