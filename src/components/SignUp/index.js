import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { PASSWORD_VALIDATION_RULES, EMAIL_VALIDATION_RULES } from '../../constants/validation';

import { Form, Icon, Input, Button, Col, Row, Card, Checkbox } from 'antd';

const SignUpPage = () => (
  <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
    <Col style={{ width: 500 }}>
      <SignUpForm />
    </Col>
  </Row>
);

class SignUpFormBase extends Component {

  passwordMatchValidator = (rule, value, callback) => {
    try {
      const { getFieldValue } = this.props.form;
      const passwordOne = getFieldValue('passwordOne');
      if (passwordOne !== value) {
        throw new Error('Passwords do not match.');
      }
      callback()
    } catch (err) {
      callback(err);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var cart = [];
        const { getFieldsValue } = this.props.form;
        const { username, email, passwordOne, isAdmin } = getFieldsValue(['username', 'email', 'passwordOne', 'isAdmin']);
        const roles = {};
        if (isAdmin) {
          roles[ROLES.ADMIN] = ROLES.ADMIN;
        }
        this.props.firebase
          .doCreateUserWithEmailAndPassword(email, passwordOne)
          .then(authUser => {
            // Create a user in your Firebase realtime database
            return this.props.firebase
              .user(authUser.user.uid)
              .set(
                {
                username,
                email,
                roles,
                cart
              },
              { merge: true },
            );
          })
          .then(() => {
            return this.props.firebase.doSendEmailVerification();
          })
          .then(() => {
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => {
            console.log(error.message);
          });
      } else {
        console.log(err.message);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row style={{height:1000}}>
      <Card style={{marginTop:30}} title="Register">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please enter a Username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
                name="username"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [EMAIL_VALIDATION_RULES],
            })(
              <Input
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                name="email"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('passwordOne', {
              rules: [PASSWORD_VALIDATION_RULES],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                name="passwordOne"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('passwordTwo', {
              rules: [PASSWORD_VALIDATION_RULES, { validator: this.passwordMatchValidator }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Confirm Password"
                name="passwordTwo"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
      </Row>
    );
  }
}

const SignUpLink = () => (
  <p>
    <Link to={ROUTES.SIGN_UP}>Register</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(Form.create()(SignUpFormBase));


export default SignUpPage;
export { SignUpForm, SignUpLink };
