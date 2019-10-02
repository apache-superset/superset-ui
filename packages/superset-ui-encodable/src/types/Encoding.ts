import { ChannelType, ChannelTypeToDefMap } from './Channel';
import { Value } from './VegaLite';
import ChannelEncoder from '../encoders/ChannelEncoder';

export type EncodingConfig = {
  [k in string]: [ChannelType, Value, 'multiple'?];
};

export type DeriveChannelTypes<Config extends EncodingConfig> = {
  readonly [k in keyof Config]: Config[k]['0'];
};

export type DeriveChannelOutputs<Config extends EncodingConfig> = {
  readonly [k in keyof Config]: Config[k]['1'];
};

export type DeriveEncoding<Config extends EncodingConfig> = {
  [k in keyof Config]: Config[k]['2'] extends 'multiple'
    ? ChannelTypeToDefMap<Config[k]['1']>[Config[k]['0']][]
    : ChannelTypeToDefMap<Config[k]['1']>[Config[k]['0']];
};

export type DeriveChannelEncoders<Config extends EncodingConfig> = {
  readonly [k in keyof Config]: Config[k]['2'] extends 'multiple'
    ? ChannelEncoder<ChannelTypeToDefMap<Config[k]['1']>[Config[k]['0']]>[]
    : ChannelEncoder<ChannelTypeToDefMap<Config[k]['1']>[Config[k]['0']]>;
};

// // Testing

// type Config = {
//   x: ['X', number];
//   y: ['Y', number];
//   size: ['Numeric', number];
//   tooltip: ['Text', string, 'multiple'];
// };

// type ChannelTypes = DeriveChannelTypes<Config>;
// type ChannelOutputs = DeriveChannelOutputs<Config>;
// type Encoding = DeriveEncoding<Config>;
// type ChannelEncoders = DeriveChannelEncoders<Config>;
