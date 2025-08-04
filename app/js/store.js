const store = {
  models: [],
  units: [],
  videos: [],
  config: {},
};

const proxiedStore = new Proxy(store, {});

export default proxiedStore;
