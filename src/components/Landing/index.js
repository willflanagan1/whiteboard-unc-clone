import React from 'react';

import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import { Redirect } from 'react-router-dom';

import { Row, Col, Alert } from 'antd';

const Landing = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <Redirect
          to={{
            pathname: ROUTES.HOME
          }}
        />
      ) : (
          <LandingPageBase />
        )
    }
  </AuthUserContext.Consumer>
);

const LandingPageBase = () => {
  return (
    <Row style={{height:1000}}>
      <Col>
        <Row style={{marginTop:10}} type="flex" justify="center" align="middle">
          <Alert
            message="Hello!"
            description="Please Sign In or Register with a valid UNC E-mail to access Whiteboard."
            type="info"
            showIcon
          />
        </Row>
      </Col>
    </Row>
  );
}

export default Landing;
