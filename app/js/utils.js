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

export function renderNav() {
  let navEl = document.querySelector(".main-nav");
  if (!navEl) return;

  navEl.innerHTML = `
  <ul>
    <li>'Oli Database</li>
    <li><a class="navlink" href="/">Models</a></li>
    <li>
      <a class="navlink" href="/models-comparison/"
        >Comparison</a
      >
    </li>
  </ul>
  `;
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
