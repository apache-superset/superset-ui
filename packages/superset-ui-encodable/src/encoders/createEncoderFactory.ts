import Encoder from './Encoder';
import { ChannelType } from '../types/Channel';
import { Encoding } from '../types/Encoding';
import mergeEncoding from '../utils/mergeEncoding';

type CreateEncoderFactoryParams<
  ChannelTypes extends Record<string, ChannelType>,
  CustomEncoding extends Encoding<keyof ChannelTypes>
> =
  | {
      channelTypes: ChannelTypes;
      /**
       * use the default approach to merge default encoding with user-specified encoding
       * if there are missing fields
       */
      defaultEncoding: CustomEncoding;
    }
  | {
      channelTypes: ChannelTypes;
      /**
       * custom way to complete the encoding
       * if there are missing fields
       */
      completeEncoding: (e: Partial<CustomEncoding>) => CustomEncoding;
    };

export default function createEncoderFactory<
  CustomChannelTypes extends Record<string, ChannelType>,
  CustomEncoding extends Encoding<keyof CustomChannelTypes>
>(params: CreateEncoderFactoryParams<CustomChannelTypes, CustomEncoding>) {
  const { channelTypes } = params;
  const completeEncoding =
    'defaultEncoding' in params
      ? (encoding: Partial<CustomEncoding>) => mergeEncoding(params.defaultEncoding, encoding)
      : params.completeEncoding;

  return {
    channelTypes,
    create: (encoding: Partial<CustomEncoding>) =>
      new Encoder<CustomChannelTypes, CustomEncoding>({
        channelTypes,
        encoding: completeEncoding(encoding),
      }),
    DEFAULT_ENCODING: completeEncoding({}),
  };
}
