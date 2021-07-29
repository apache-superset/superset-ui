import { FeatureFlag, isFeatureEnabled, t } from '@superset-ui/core';

const enableCrossFilter = isFeatureEnabled(FeatureFlag.DASHBOARD_CROSS_FILTERS);

export const emitFilterControl = enableCrossFilter
  ? [
      {
        name: 'emit_filter',
        config: {
          type: 'CheckboxControl',
          label: t('Emit dashboard cross filters'),
          default: false,
          renderTrigger: true,
          description: t('Emit dashboard cross filters.'),
        },
      },
    ]
  : [];
