import { get } from 'lodash/fp';
import identity from '../utils/identity';
import { ChannelDef } from '../types/ChannelDef';
import { isValueDef } from '../typeGuards/ChannelDef';

export default function createGetterFromChannelDef(definition: ChannelDef): (x?: any) => any {
  if (isValueDef(definition)) {
    return () => definition.value;
  } else if (typeof definition.field !== 'undefined') {
    return get(definition.field);
  }

  return identity;
}
