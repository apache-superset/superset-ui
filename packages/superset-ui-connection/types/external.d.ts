declare module 'fetch-mock';

declare module 'json-bigint' {
  class JSONbig {
    static parse(s: string): any;
  }
  export = JSONbig;
}
