import { SupersetClientInterface } from './types';

export default function withSupersetClient<T>(
  func: ({ client, ...rest }: { client: SupersetClientInterface; [key: string]: unknown }) => T,
) {
  return (...args) => func(...args);
}
