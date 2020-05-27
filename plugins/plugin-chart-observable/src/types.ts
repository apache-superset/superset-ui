import { QueryFormData } from '@superset-ui/query';
import { ObservableVisualProps } from './chart/Observable';

// FormData for observable contains both common properties of all form data
// and properties specific to observable visualization
export type ObservableFormData = QueryFormData &
  ObservableVisualProps & {
    series: string;
    observableUrl: string;
  };
