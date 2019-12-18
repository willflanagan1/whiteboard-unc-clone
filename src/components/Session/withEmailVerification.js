import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

import { Button, Card } from 'antd';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isSent: false };
    }
    onSendEmailVerification = () => {
      this.props.firebase.doSendEmailVerification()
      .then(() => this.setState({ isSent: true }));
    }
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <Card>
                {this.state.isSent ? (
                  <p>
                    E-Mail confirmation sent: Check you E-Mails (Spam
                    folder included) for a confirmation E-Mail.
                    Refresh this page once you confirmed your E-Mail.
                  </p>
                ) : (
                  <>
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={this.onSendEmailVerification}
                      style={{ width: '100%' }}>
                      Send confirmation E-Mail
                    </Button>
                    <p>
                      Verify your E-Mail: Check you E-Mails (Spam folder
                      included) for a confirmation E-Mail or send
                      another confirmation E-Mail.
                    </p>
                  </>
                )}
              </Card>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
