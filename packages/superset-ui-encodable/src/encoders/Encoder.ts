import { flatMap } from 'lodash';
import { ChannelDef, TypedFieldDef } from '../types/ChannelDef';
import { MayBeArray } from '../types/Base';
import { isFieldDef, isTypedFieldDef } from '../typeGuards/ChannelDef';
import { isNotArray } from '../typeGuards/Base';
import ChannelEncoder from './ChannelEncoder';
import {
  EncodingConfig,
  DeriveEncoding,
  DeriveChannelTypes,
  DeriveChannelEncoders,
  DeriveChannelOutputs,
} from '../types/Encoding';
import { Dataset } from '../types/Data';
import { Value } from '../types/VegaLite';
import { ChannelInput } from '../types/Channel';

export default class Encoder<Config extends EncodingConfig> {
  readonly encoding: DeriveEncoding<Config>;
  readonly channelTypes: DeriveChannelTypes<Config>;
  readonly channels: DeriveChannelEncoders<Config>;

  readonly legends: {
    [key: string]: (keyof Config)[];
  };

  constructor({
    channelTypes,
    encoding,
  }: {
    channelTypes: DeriveChannelTypes<Config>;
    encoding: DeriveEncoding<Config>;
  }) {
    this.channelTypes = channelTypes;
    this.encoding = encoding;
    const channelNames = this.getChannelNames();

    // Create channel encoders
    const channels: { [k in keyof Config]?: MayBeArray<ChannelEncoder<ChannelDef>> } = {};

    channelNames.forEach(name => {
      const channelEncoding = encoding[name] as MayBeArray<ChannelDef>;
      if (Array.isArray(channelEncoding)) {
        const definitions = channelEncoding;
        channels[name] = definitions.map(
          (definition, i) =>
            new ChannelEncoder({
              channelType: channelTypes[name],
              definition,
              name: `${name}[${i}]`,
            }),
        );
      } else {
        const definition = channelEncoding;
        channels[name] = new ChannelEncoder({
          channelType: channelTypes[name],
          definition,
          name: name as string,
        });
      }
    });

    this.channels = channels as DeriveChannelEncoders<Config>;

    // Group the channels that use the same field together
    // so they can share the same legend.
    this.legends = {};
    channelNames
      .map(name => this.channels[name])
      .forEach(c => {
        if (isNotArray(c) && c.hasLegend() && isFieldDef(c.definition)) {
          const name = c.name as keyof Config;
          const { field } = c.definition;
          if (this.legends[field]) {
            this.legends[field].push(name);
          } else {
            this.legends[field] = [name];
          }
        }
      });
  }

  getChannelNames() {
    return Object.keys(this.channelTypes) as (keyof Config)[];
  }

  getChannelEncoders() {
    return this.getChannelNames().map(name => this.channels[name]);
  }

  getGroupBys() {
    const fields = flatMap(this.getChannelEncoders())
      .filter(c => c.isGroupBy())
      .map(c => (c.definition as TypedFieldDef).field!);

    return Array.from(new Set(fields));
  }

  getLegendInformation(data: Dataset) {
    return (
      Object.keys(this.legends)
        // for each field that was encoded
        .map((field: string) => {
          // get all the channels that use this field
          const channelNames = this.legends[field];
          // get first channelEncoder
          const channelEncoder = this.channels[channelNames[0]];
          // apply type guards
          if (isNotArray(channelEncoder) && isTypedFieldDef(channelEncoder.definition)) {
            // Only work for nominal channels now
            // TODO: Add support for numerical scale
            if (channelEncoder.definition.type === 'nominal') {
              return channelEncoder.getDomain(data).map((value: ChannelInput) => ({
                field,
                value,
                // eslint-disable-next-line sort-keys
                output: channelNames.reduce(
                  (prev: Partial<{ [k in keyof Config]: Config[k]['1'] }>, curr) => {
                    const map = prev;
                    const channel = this.channels[curr];
                    if (isNotArray(channel)) {
                      map[curr] = channel.encodeValue(`${value}`) as Value;
                    }

                    return map;
                  },
                  {},
                ),
              }));
            }
          }

          return [];
        })
        .filter(items => items.length > 0)
    );
  }

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
