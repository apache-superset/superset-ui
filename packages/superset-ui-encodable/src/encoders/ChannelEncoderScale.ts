import ChannelEncoder from './ChannelEncoder';
import { ChannelDef } from '../types/ChannelDef';
import { Value } from '../types/VegaLite';
import { CompleteScaleConfig } from '../fillers/completeScaleConfig';
import { Dataset } from '../types/Data';
import createScaleFromScaleConfig from '../parsers/scale/createScaleFromScaleConfig';
import { AllScale } from '../types/Scale';
import applyDomain from '../parsers/scale/applyDomain';
import applyZero from '../parsers/scale/applyZero';
import applyNice from '../parsers/scale/applyNice';

export default class ChannelEncoderScale<
  Def extends ChannelDef<Output>,
  Output extends Value = Value
> {
  readonly channelEncoder: ChannelEncoder<Def, Output>;
  readonly config: Exclude<CompleteScaleConfig<Output>, false>;
  readonly scale: AllScale<Output>;

  constructor(channelEncoder: ChannelEncoder<Def, Output>) {
    this.channelEncoder = channelEncoder;
    this.config = channelEncoder.definition.scale as Exclude<CompleteScaleConfig<Output>, false>;
    this.scale = createScaleFromScaleConfig(this.config);
  }

  setDomainFromDataset(data: Dataset) {
    if ('domain' in this.scale) {
      const domain = this.channelEncoder.getDomainFromDataset(data);
      applyDomain(this.config, this.scale, domain);
      applyZero(this.config, this.scale);
      applyNice(this.config, this.scale);
    }
  }
}
