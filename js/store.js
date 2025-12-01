const store = {
  models: [],
  units: [],
  videos: [],
  tonewoods: [],
};

const proxiedStore = new Proxy(store, {});

export default proxiedStore;
