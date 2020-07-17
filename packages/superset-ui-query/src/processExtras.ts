/* eslint-disable camelcase */
import { QueryFormData, isDruidFormData } from './types/QueryFormData';

export default function processExtras(formData: QueryFormData) {
  if (isDruidFormData(formData)) {
    const { druid_time_origin, having_druid } = formData;

    return { druid_time_origin, having_druid };
  }

  const { time_grain_sqla, having } = formData;

  return { having, time_grain_sqla };
}
