import { Encoding } from '../types/Encoding';

export default function mergeEncoding<CustomEncoding extends Encoding<string>>(
  defaultEncoding: CustomEncoding,
  encoding: Partial<CustomEncoding>,
): CustomEncoding {
  return {
    ...defaultEncoding,
    ...encoding,
  };
}
