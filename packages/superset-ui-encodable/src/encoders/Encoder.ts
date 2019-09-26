import { flatMap } from 'lodash';
import { Value } from '../types/VegaLite';
import { ChannelType, ChannelInput } from '../types/Channel';
import { ChannelDef } from '../types/ChannelDef';
import { Dataset } from '../types/Data';
import { Unarray, MayBeArray } from '../types/Base';
import { isFieldDef, isTypedFieldDef } from '../typeGuards/ChannelDef';
import { isArray, isNotArray } from '../typeGuards/Base';
import ChannelEncoder from './ChannelEncoder';
import { Encoding } from '../types/Encoding';

type AllChannelEncoders<Encoding extends Record<string, MayBeArray<ChannelDef>>> = {
  readonly [k in keyof Encoding]: Encoding[k] extends any[]
    ? ChannelEncoder<Unarray<Encoding[k]>>[]
    : ChannelEncoder<Unarray<Encoding[k]>>;
};

export default class Encoder<
  ChannelTypes extends Record<string, ChannelType>,
  CustomEncoding extends Encoding<keyof ChannelTypes>
> {
  readonly encoding: CustomEncoding;
  readonly channelTypes: ChannelTypes;
  readonly channels: AllChannelEncoders<CustomEncoding>;

  readonly legends: {
    [key: string]: (keyof CustomEncoding)[];
  };

  constructor({
    channelTypes,
    encoding,
  }: {
    channelTypes: ChannelTypes;
    encoding: CustomEncoding;
  }) {
    this.channelTypes = channelTypes;
    this.encoding = encoding;
    const channelNames = this.getChannelNames();

    const channels: { [k in keyof CustomEncoding]?: MayBeArray<ChannelEncoder<ChannelDef>> } = {};

    channelNames.forEach(name => {
      const channelEncoding = encoding[name];
      if (isArray(channelEncoding)) {
        const definitions = channelEncoding;
        channels[name] = definitions.map(
          (definition, i) =>
            new ChannelEncoder({
              channelType: 'Text',
              definition,
              name: `${name}[${i}]`,
            }),
        );
      } else if (isNotArray(channelEncoding)) {
        const definition = channelEncoding;
        channels[name] = new ChannelEncoder({
          channelType: channelTypes[name],
          definition,
          name: name as string,
        });
      }
    });

    this.channels = channels as AllChannelEncoders<CustomEncoding>;

    type ChannelName = keyof CustomEncoding;

    // Group the channels that use the same field together
    // so they can share the same legend.
    this.legends = {};
    channelNames
      .map(name => this.channels[name])
      .forEach(c => {
        if (isNotArray(c) && c.hasLegend() && isFieldDef(c.definition)) {
          const name = c.name as ChannelName;
          const { field } = c.definition;
          if (this.legends[field]) {
            this.legends[field].push(name);
          } else {
            this.legends[field] = [name];
          }
        }
      });
  }

  // /**
  //  * subclass can override this
  //  */
  // createFullSpec(spec: PartialSpec<Encoding, Options>, defaultEncoding?: Encoding) {
  //   if (typeof defaultEncoding === 'undefined') {
  //     return spec as FullSpec<Encoding, Options>;
  //   }

  //   const { encoding, ...rest } = spec;

  //   return {
  //     ...rest,
  //     encoding: {
  //       ...defaultEncoding,
  //       ...encoding,
  //     },
  //   };
  // }

  getChannelNames() {
    return Object.keys(this.channelTypes) as (keyof ChannelTypes)[];
  }

  getChannelsAsArray() {
    return this.getChannelNames().map(name => this.channels[name]);
  }

  getGroupBys() {
    const fields = flatMap(this.getChannelsAsArray())
      .filter(c => c.isGroupBy())
      .map(c => (isFieldDef(c.definition) ? c.definition.field : ''))
      .filter(field => field !== '');

    return Array.from(new Set(fields));
  }

  // getLegendInfos(data: Dataset) {
  //   return Object.keys(this.legends)
  //     .map((field: string) => {
  //       const channelNames = this.legends[field];
  //       const channelEncoder = this.channels[channelNames[0]];

  //       if (isNotArray(channelEncoder) && isTypedFieldDef(channelEncoder.definition)) {
  //         // Only work for nominal channels now
  //         // TODO: Add support for numerical scale
  //         if (channelEncoder.definition.type === 'nominal') {
  //           const domain = channelEncoder.getDomain(data) as string[];

  //           return domain.map((value: ChannelInput) => ({
  //             field,
  //             value,
  //             // eslint-disable-next-line sort-keys
  //             encodedValues: channelNames.reduce(
  //               (prev: Partial<Record<keyof Encoding, Value | undefined>>, curr) => {
  //                 const map = prev;
  //                 const channel = this.channels[curr];
  //                 if (isNotArray(channel)) {
  //                   map[curr] = channel.encodeValue(value);
  //                 }

  //                 return map;
  //               },
  //               {},
  //             ),
  //           }));
  //         }
  //       }

  //       return [];
  //     })
  //     .filter(items => items.length > 0);
  // }

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
