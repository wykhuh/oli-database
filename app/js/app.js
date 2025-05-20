async function getData() {
  return fetch("./oli_lists.json")
    .then((res) => res.json())
    .then((data) => data);
}

(async () => {
  const data = await getData();
  // data.forEach((row) => {
  //   row["links"] = "hi";
  // });

  const pel = document.createElement("p");
  pel.textContent = JSON.stringify(data[3]);
  const tempEl = document.querySelector(".temp");
  tempEl?.appendChild(pel);

  var options = {
    valueNames: [
      "model",
      "tier",
      "type",
      "size",
      "top_wood",
      "back_wood",
      "finish",
      "other",
      "price",
      "links",
      "published_at",
      "new_model",
    ],
    item: `
      <td class="model"></td>
      <td class="tier"></td>
      <td class="type"></td>
      <td class="size"></td>
      <td class="top_wood"></td>
      <td class="back_wood"></td>
      <td class="finish"></td>
      <td class="other"></td>
      <td class="price"></td>
      <td class="links"></td>
      <td class="published_at"></td>
      <td class="new_model"></td>
      </tr>`,
  };

  console.log(options);
  console.log(data);
  new List("ukes", options, data);
})();
