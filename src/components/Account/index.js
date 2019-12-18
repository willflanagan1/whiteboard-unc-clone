import React from 'react';
import { compose } from 'recompose';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import Offerings from '../Offerings/Offerings'

import { Row, Col } from 'antd';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Row type="flex" justify="center" style={{marginTop:10}} >
        <h1 style={{textAlign:"center",width: 1000 }}>Account: {authUser.email}</h1>
        <Col style={{ width: 1000 }}>
          <Row type="flex" justify="space-around">
            <Col span={10}>
              <PasswordForgetForm />
            </Col>
            <Col span={10}>
              <PasswordChangeForm />
            </Col>
          </Row>
          <Row>
            <Offerings user={authUser.uid} />
          </Row>
        </Col>
      </Row>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);
