/* eslint jsx-a11y/label-has-associated-control: 'off', jsx-a11y/label-has-for: 'off' */
import React from 'react';
import PropTypes from 'prop-types';

import { SupersetClient } from '@superset-ui/connection';
import { bigNumberFormData } from '../mocks/formData';

class ConfigureCORS extends React.Component {
  constructor(props) {
    super(props);
    this.handleConfigureCORS = this.handleConfigureCORS.bind(this);

    this.state = {
      endpoint: '',
      host: '',
      method: 'POST',
      postPayload: JSON.stringify({ form_data: bigNumberFormData }),
      status: null,
    };
  }

  handleConfigureCORS() {
    const { endpoint, host, postPayload, method } = this.state;

    SupersetClient.reset();

    SupersetClient.configure({
      credentials: 'include',
      host,
      mode: 'cors',
    })
      .init()
      .then(() =>
        // Test an endpoint if specified
        endpoint
          ? SupersetClient.request({
              endpoint,
              method,
              postPayload: postPayload ? JSON.parse(postPayload) : '',
            })
          : Promise.resolve(),
      )
      .then(payload => this.setState({ payload, status: 'success!' }))
      .catch(error => {
        const { status, statusText = error } = error;

        this.setState({
          error: `${status || ''}${status ? ':' : ''} ${statusText}`,
          status: 'error',
        });
      });
  }

  renderVerboseInstructions() {
    return (
      <>
        This story helps you test CORS configuration with the Superset App. <br />
        1) enable CORS for desired endpoints in Superset for this domain <br /> 2) enter its host
        (with port) and desired endpoint here <br />
        3) test requests from this domain
      </>
    );
  }

  render() {
    const { verbose } = this.props;
    const { host, endpoint, method, status, error, payload, postPayload } = this.state;

    return (
      <div style={{ margin: 16 }}>
        <div className="row">
          <div className="col-sm-6">
            {verbose
              ? this.renderVerboseInstructions()
              : `Test your Superset App CORS configuration below.`}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-6">
            <div className="form">
              <div className="form-group">
                <label>Superset Host:&nbsp;&nbsp;</label>
                <input
                  id="host"
                  className="form-control form-control-sm"
                  type="text"
                  value={host}
                  placeholder="e.g., localhost:9000"
                  onChange={e => {
                    this.setState({ host: e.target.value });
                  }}
                />
              </div>
              {verbose && (
                <>
                  <div className="form-group">
                    <label>Superset Endpoint:&nbsp;&nbsp;</label>
                    <input
                      id="endpoint"
                      className="form-control form-control-sm"
                      type="text"
                      value={endpoint}
                      onChange={e => {
                        this.setState({ endpoint: e.target.value });
                      }}
                      placeholder="Leave empty to only test auth"
                    />
                  </div>
                  {endpoint && (
                    <div className="form-group">
                      <label>Endpoint Method:&nbsp;&nbsp;</label>
                      <input
                        id="method"
                        className="form-control form-control-sm"
                        type="text"
                        value={method}
                        onChange={e => {
                          this.setState({ method: e.target.value });
                        }}
                      />
                    </div>
                  )}
                  {endpoint && method === 'POST' && (
                    <div className="form-group">
                      <label>Post payload:&nbsp;&nbsp;</label>
                      <input
                        id="postPayload"
                        className="form-control form-control-sm"
                        type="text"
                        value={postPayload}
                        onChange={e => {
                          this.setState({ postPayload: e.target.value });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={this.handleConfigureCORS}
            >
              Test Auth
            </button>
          </div>
        </div>
        <br />
        {status && (
          <div className="row">
            <div className="col-sm-6">
              <div className={`alert alert-${status === 'error' ? 'danger' : 'success'}`}>
                {status === 'error' ? error : status}
                {payload ? (
                  <>
                    <br />
                    <pre style={{ fontSize: 10 }}>{JSON.stringify(payload, null, 2)}</pre>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

ConfigureCORS.propTypes = {
  /** Whether to expose detailed controls, or not. */
  verbose: PropTypes.bool,
};

ConfigureCORS.defaultProps = {
  verbose: true,
};

export default ConfigureCORS;
