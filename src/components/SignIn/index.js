import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Form, Icon, Input, Button, Col, Row, Card } from 'antd';

const SignInPage = () => (
  <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
    <Col style={{ width: 500 }}>
      <SignInForm />
    </Col>
  </Row>
);

class SignInFormBase extends Component {

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password } = values;
        this.props.firebase
          .doSignInWithEmailAndPassword(email, password)
          .then(() => {
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => {
            console.log(error.message);
        });
      } else {
        console.log('Error: ', err);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row style={{height:1000}}>
      <Card style={{marginTop:30}} title="Sign In">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your Email!' }],
            })(
              <Input
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                name="email"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                name="password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', marginBottom: '15px' }}
            >
              Sign In
            </Button>
          </Form.Item>
          <Row>
            <Col span={12}>
              <PasswordForgetLink />
            </Col>
            <Col span={12}>
              <Row type="flex" justify="end">
                <SignUpLink />
              </Row>

            </Col>
          </Row>
        </Form>
      </Card>
      </Row>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(Form.create()(SignInFormBase));

export default SignInPage;
export { SignInForm };
