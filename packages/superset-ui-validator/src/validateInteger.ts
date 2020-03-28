import { t } from '@superset-ui/translation';

export default function validateInteger(v: unknown) {
  if (
    (typeof v === 'string' && Number.isInteger(Number(v))) ||
    (typeof v === 'number' && Number.isInteger(v))
  ) {
    return false;
  }

  return t('is expected to be an integer');
}
