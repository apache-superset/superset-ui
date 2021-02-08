import { ExtraFormData } from '../../query';

export type HandlerFunction = (...args: unknown[]) => void;

export type SetExtraFormDataHook = {
  ({
    extraFormData,
    currentState: { value },
  }: {
    extraFormData: ExtraFormData;
    currentState: { value: any; [key: string]: any };
  }): void;
};

export interface PlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
