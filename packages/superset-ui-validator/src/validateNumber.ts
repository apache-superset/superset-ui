import { t } from '@superset-ui/translation';

export default function validateInteger(v: unknown) {
  if (
    (typeof v === 'string' && Number.isFinite(Number(v))) ||
    (typeof v === 'number' && Number.isFinite(v))
  ) {
    return false;
  }

  return t('is expected to be a number');
}
