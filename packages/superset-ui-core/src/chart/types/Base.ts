import { ExtraFormData } from '../../query';

export type HandlerFunction = (...args: unknown[]) => void;

export enum Behavior {
  CROSS_FILTER = 'CROSS_FILTER',
  NATIVE_FILTER = 'NATIVE_FILTER',
}

export type SetDataMaskHook = {
  ({
    native,
    cross,
    own,
  }: {
    native?: {
      extraFormData: ExtraFormData;
      currentState: { value: any; [key: string]: any };
    };
    cross?: {
      extraFormData: ExtraFormData;
      currentState: { [key: string]: any };
    };
    own?: {
      extraFormData: ExtraFormData;
      currentState: { [key: string]: any };
    };
  }): void;
};

export interface PlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
