import { extent as d3Extent } from 'd3-array';
import { ChannelType, ChannelInput } from '../types/Channel';
import { PlainObject, Dataset } from '../types/Data';
import { ChannelDef, ExtractChannelOutput } from '../types/ChannelDef';
import createGetterFromChannelDef from '../parsers/createGetterFromChannelDef';
import completeChannelDef, { CompleteChannelDef } from '../fillers/completeChannelDef';
import createFormatterFromChannelDef from '../parsers/format/createFormatterFromChannelDef';
import createScaleFromScaleConfig from '../parsers/scale/createScaleFromScaleConfig';
import identity from '../utils/identity';
import { HasToString } from '../types/Base';
import { isTypedFieldDef } from '../typeGuards/ChannelDef';
import { isX, isY, isXOrY } from '../typeGuards/Channel';

type Identity<T> = (value: T) => T;

type EncodeFunction<Def extends ChannelDef> = (
  value: ChannelInput | ExtractChannelOutput<Def>,
) => ExtractChannelOutput<Def> | null | undefined;

export default class ChannelEncoder<Def extends ChannelDef> {
  readonly name: string | Symbol | number;
  readonly channelType: ChannelType;
  readonly originalDefinition: Def;
  readonly definition: CompleteChannelDef;
  readonly scale: false | ReturnType<typeof createScaleFromScaleConfig>;

  readonly getValue: (datum: PlainObject) => ChannelInput;
  readonly encodeValue:
    | Identity<ChannelInput | ExtractChannelOutput<Def> | null | undefined>
    | EncodeFunction<Def>;

  readonly formatValue: (value: ChannelInput | HasToString) => string;

  constructor({
    name,
    channelType,
    definition: originalDefinition,
  }: {
    name: string;
    channelType: ChannelType;
    definition: Def;
  }) {
    this.name = name;
    this.channelType = channelType;
    this.originalDefinition = originalDefinition;
    const definition = completeChannelDef(this.channelType, originalDefinition);
    this.definition = definition;

    this.getValue = createGetterFromChannelDef(definition);
    this.formatValue = createFormatterFromChannelDef(definition);
    const scale = definition.scale && createScaleFromScaleConfig(definition.scale);
    // this.axis = definition.axis && ...

    this.encodeValue = scale === false ? identity : (value: ChannelInput) => scale(value);
    this.scale = scale;

    this.encodeDatum = this.encodeDatum.bind(this);
    this.formatDatum = this.formatDatum.bind(this);
    this.getValueFromDatum = this.getValueFromDatum.bind(this);
  }

  encodeDatum(datum: PlainObject): ExtractChannelOutput<Def> | null | undefined;
  // eslint-disable-next-line no-dupe-class-members
  encodeDatum(datum: PlainObject, otherwise: ExtractChannelOutput<Def>): ExtractChannelOutput<Def>;
  // eslint-disable-next-line no-dupe-class-members
  encodeDatum(datum: PlainObject, otherwise?: ExtractChannelOutput<Def>) {
    const value = this.getValueFromDatum(datum);
    if (value === null || value === undefined) {
      return otherwise;
    }

    const output = this.encodeValue(value);

    return otherwise !== undefined && (output === null || output === undefined)
      ? otherwise
      : output;
  }

  formatDatum(datum: PlainObject): string {
    return this.formatValue(this.getValueFromDatum(datum));
  }

  getValueFromDatum<T extends ChannelInput | ExtractChannelOutput<Def>>(
    datum: PlainObject,
    otherwise?: T,
  ) {
    const value = this.getValue(datum);

    return otherwise !== undefined && (value === null || value === undefined)
      ? otherwise
      : (value as T);
  }

  getDomain(data: Dataset) {
    if (isTypedFieldDef(this.definition)) {
      const { type } = this.definition;
      if (type === 'nominal' || type === 'ordinal') {
        return Array.from(new Set(data.map(d => this.getValueFromDatum(d)))) as string[];
      } else if (type === 'quantitative') {
        const extent = d3Extent(data, d => this.getValueFromDatum<number>(d));
        if (typeof extent[0] === 'undefined') {
          return [0, 1];
        }

        return extent as [number, number];
      } else if (type === 'temporal') {
        const extent = d3Extent(data, d => this.getValueFromDatum<number | Date>(d));
        if (typeof extent[0] === 'undefined') {
          return [0, 1];
        }

        return extent as [number, number] | [Date, Date];
      }
    }

    return [];
  }

  getTitle() {
    return this.definition.title;
  }

  isGroupBy() {
    if (isTypedFieldDef(this.definition)) {
      const { type } = this.definition;

      return (
        this.channelType === 'Category' ||
        this.channelType === 'Text' ||
        (this.channelType === 'Color' && (type === 'nominal' || type === 'ordinal')) ||
        (this.isXOrY() && (type === 'nominal' || type === 'ordinal'))
      );
    }

    return false;
  }

  isX() {
    return isX(this.channelType);
  }

  isXOrY() {
    return isXOrY(this.channelType);
  }

  isY() {
    return isY(this.channelType);
  }
}
