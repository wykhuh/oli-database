export const config = {
  home: {
    title: "'Oli Models",
    displayFields: [
      "Model",
      "Tier",
      "Size",
      "Top Wood",
      "Back Wood",
      "Finish",
      "Model Notes",
      "Video Published At",
      "Add to playlist",
    ],
    link: { textField: "Model", idField: "Oli Id", path: "models" },
    sortable: true,
    extraFields: [
      {
        field: "Add to playlist",
        content: '<input class="model" type="checkbox" data-id="**idField**" />',
      },
    ],
    nonSortableFields: ["Add to playlist"],
  },
  modelDetails: {
    modelFields: ["Model", "Tier", "Size", "Top Wood", "Back Wood", "Finish", "Limited Edition"],
    displayFields: ["Model", "Top Wood", "Back Wood", "Model Notes"],
    unitFields: [
      "Model",
      "Top Wood",
      "Back Wood",
      "Price",
      "Serial Number",
      "Model Notes",
      "Notes",
      "Video Published At",
      "Limited Edition",
    ],
    sortable: false,
  },
  tonewoods: {
    displayFields: ["Top Wood", "Back Wood", "Soprano", "Concert", "Tenor", "Baritone"],
    sortable: true,
  },
};
