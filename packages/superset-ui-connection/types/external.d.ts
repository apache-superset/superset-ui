declare module 'json-bigint' {
  class JSONbig {
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object.
     * @param text A valid JSON string.
     */
    static parse(text: string): any;

    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     */
    static stringify(value: any): string;
  }
  export = JSONbig;
}
