import React, { ReactNode } from 'react';
import {
  SupersetClientInterface,
  SupersetClientResponse,
} from '../../../superset-ui-connection/src/types';
import { ChartFormData } from '../types/ChartFormData';

export interface ProviderData {
  payload?: object;
  error?: any;
  loading?: boolean;
}

export type Props = {
  /** Superset client which is used to fetch data. It should already be configured and initialized. */
  client: SupersetClientInterface;
  /** G */
  formData: ChartFormData;
  /** Child function called with */
  children: (data: ProviderData) => ReactNode;
};

type State = {
  status: 'unitialized' | 'fetching' | 'error' | 'loaded';
  payload?: ProviderData['payload'];
  error?: ProviderData['error'];
};

class DataProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleFetchData = this.handleFetchData.bind(this);
    this.handleReceiveData = this.handleReceiveData.bind(this);
    this.handleError = this.handleError.bind(this);
    this.state = { status: 'unitialized' };
  }

  componentDidMount() {
    this.handleFetchData();
  }

  componentDidUpdate() {}

  handleFetchData() {
    this.setState({ status: 'fetching' }, () => {
      try {
        this.props.client
          .post({
            // @TODO we need to make the full url / host
            endpoint: '/superset/explore_json/',
            postPayload: {
              form_data: this.props.formData,
            },
          })
          .then(this.handleReceiveData)
          .catch(this.handleError);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  handleReceiveData(response: SupersetClientResponse) {
    this.setState({ payload: response.json, status: 'loaded' });
  }

  handleError(error: ProviderData['error']) {
    this.setState({ error, status: 'error' });
  }

  render() {
    const { children } = this.props;
    const { status, payload, error } = this.state;

    const args: ProviderData = {};

    if (status === 'unitialized') {
      return null;
    } else if (status === 'fetching') {
      args.loading = true;
    } else if (status === 'error') {
      args.error = error;
    } else if (status === 'loaded') {
      args.payload = payload;
    }

    return children(args);
  }
}

export default DataProvider;
