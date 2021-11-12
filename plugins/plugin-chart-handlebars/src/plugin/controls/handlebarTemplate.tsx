import {
  ControlConfig,
  ControlSetItem,
  CustomControlConfig,
  sharedControls,
} from '@superset-ui/chart-controls';
import { t, validateNonEmpty } from '@superset-ui/core';
import React from 'react';
import { CodeEditor } from '../../components/CodeEditor/CodeEditor';
import { ControlHeader } from '../../components/ControlHeader/controlHeader';

interface HandlebarsCustomControlProps {
  value: string;
}

const HandlbarsTemplateControl = (
  props: CustomControlConfig<HandlebarsCustomControlProps>,
) => {
  const val = String(
    props?.value ? props?.value : props?.default ? props?.default : '',
  );

  const updateConfig = (source: string) => {
    props.onChange(source);
  };
  return (
    <div>
      <ControlHeader>{props.label}</ControlHeader>
      <CodeEditor
        theme="dark"
        value={val}
        onChange={source => {
          updateConfig(source || '');
        }}
      />
    </div>
  );
};
const handlebarsTemplateControlConfig: ControlConfig<any> = {
  ...sharedControls.entity,
  type: HandlbarsTemplateControl,
  label: t('Handlebars Template'),
  description: t('A handlebars template that is applied to the data'),
  default: `<ul class="data_list">
    {{#each data}}
      <li>{{this}}</li>
    {{/each}}
  </ul>`,
  isInt: false,

  validators: [validateNonEmpty],
  mapStateToProps: ({ controls }) => ({
    value: controls?.handlebars_template?.value,
  }),
};

export const HandlbarsTemplateControlSetItem: ControlSetItem = {
  name: 'handlebarsTemplate',
  config: handlebarsTemplateControlConfig,
};
