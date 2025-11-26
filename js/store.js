const store = {
  models: [],
  units: [],
  videos: [],
  tonewoods: [],
  config: {
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
      ],
      link: { textField: "Model", idField: "Oli Id", path: "models" },
      sortable: true,
    },
    modelDetails: {
      modelFields: [
        "Model",
        "Tier",
        "Size",
        "Top Wood",
        "Back Wood",
        "Finish",
        "Limited Edition",
      ],
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
  },
};

const proxiedStore = new Proxy(store, {});

export default proxiedStore;
