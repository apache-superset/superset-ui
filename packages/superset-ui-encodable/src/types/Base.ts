/** Extract generic type from array */
export type Unarray<T> = T extends Array<infer U> ? U : T;

/** T or an array of T */
export type MayBeArray<T> = T | T[];

/** A value that has .toString() function */
export type HasToString = { toString(): string };

/** Make some fields required */
export type RequiredSome<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  {
    [P in K]-?: T[P];
  };
