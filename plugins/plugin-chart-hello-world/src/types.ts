import { QueryFormData } from '@superset-ui/query';
import { HelloWorldProps } from './HelloWorld';

// FormData contains both common properties of all form data
// and properties specific to HelloWorld visualization
// TODO: add links to TypeScript SIP, TS docs, handy @ts-ignore comments
export type HelloWorldFormData = QueryFormData &
  HelloWorldProps & {
    series: string;
  };
