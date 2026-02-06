const store = {
  models: [],
  units: [],
  videos: [],
  tonewoods: [],
  playlistModels: new Set(),
};

const proxiedStore = new Proxy(store, {});

export default proxiedStore;
