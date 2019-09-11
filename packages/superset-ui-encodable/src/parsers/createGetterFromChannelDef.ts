import { get } from 'lodash/fp';
import { ChannelDef } from '../types/ChannelDef';
import { isValueDef } from '../typeGuards/ChannelDef';
import { PlainObject } from '../types/Data';
import { Value } from '../types/VegaLite';
import { ChannelInput } from '../types/Channel';

export default function createGetterFromChannelDef<Output extends Value = Value>(
  definition: ChannelDef<Output>,
): (x?: PlainObject) => ChannelInput | undefined {
  if (isValueDef(definition)) {
    return () => definition.value;
  } else if (typeof definition.field !== 'undefined') {
    return get(definition.field);
  }

  return () => undefined;
}
