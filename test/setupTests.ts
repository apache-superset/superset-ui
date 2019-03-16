const caches = {};

class Cache {
  cache: object;
  constructor(key: string) {
    caches[key] = caches[key] || {};
    this.cache = caches[key];
  }
  match(url: string): Promise<Response | null> {
    return new Promise((resolve, reject) => resolve(this.cache[url]));
  }
  delete(url: string) {
    delete this.cache[url];
  }
  put(url: string, response: Response) {
    this.cache[url] = response;
  }
};

class Caches {
  open(key: string): Promise<Cache> {
    return new Promise((resolve, reject) => {
      resolve(new Cache(key));
    });
  }
};

global.caches = new Caches();
