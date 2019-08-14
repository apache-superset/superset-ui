import { ChannelDef } from '../types/ChannelDef';
import { isTypedFieldDef } from '../typeGuards/ChannelDef';
import fallbackFormatter from './fallbackFormatter';
import createFormatterFromFieldTypeAndFormat from './createFormatterFromFieldTypeAndFormat';
import { Value } from '../types/VegaLite';

export default function createFormatterFromChannelDef<V extends Value>(definition: ChannelDef<V>) {
  if (isTypedFieldDef(definition)) {
    const { type, format = '' } = definition;

    return createFormatterFromFieldTypeAndFormat(type, format);
  }

  return fallbackFormatter;
}
