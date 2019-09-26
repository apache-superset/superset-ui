import Encoder from './Encoder';
import { ChannelType } from '../types/Channel';
import { Encoding } from '../types/Encoding';
import mergeEncoding from '../utils/mergeEncoding';

type CreateEncoderFactoryParams<
  ChannelTypes extends Record<string, ChannelType>,
  Enc extends Encoding<keyof ChannelTypes>
> =
  | {
      channelTypes: ChannelTypes;
      /**
       * use the default approach to merge default encoding with user-specified encoding
       * if there are missing fields
       */
      defaultEncoding: Enc;
    }
  | {
      channelTypes: ChannelTypes;
      /**
       * custom way to complete the encoding
       * if there are missing fields
       */
      completeEncoding: (e: Partial<Enc>) => Enc;
    };

export default function createEncoderFactory<
  ChannelTypes extends Record<string, ChannelType>,
  Enc extends Encoding<keyof ChannelTypes>
>(params: CreateEncoderFactoryParams<ChannelTypes, Enc>) {
  const { channelTypes } = params;
  const completeEncoding =
    'defaultEncoding' in params
      ? (encoding: Partial<Enc>) => mergeEncoding(params.defaultEncoding, encoding)
      : params.completeEncoding;

  return {
    create: (encoding: Partial<Enc>) =>
      new Encoder<ChannelTypes, Enc>({
        channelTypes,
        encoding: completeEncoding(encoding),
      }),
    DEFAULT_ENCODING: completeEncoding({}),
  };
}
