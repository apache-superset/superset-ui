import { MayBeArray } from './Base';
import { ChannelDef } from './ChannelDef';

export type Encoding<Key extends string | number | symbol> = Record<Key, MayBeArray<ChannelDef>>;
