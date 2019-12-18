import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Form, Icon, Input, Button, Col, Row, Card } from 'antd';

const PasswordForgetPage = () => (
  <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
    <Col style={{ width: 500 }}>
      <PasswordForgetForm />
    </Col>
  </Row>
);

class PasswordForgetFormBase extends Component {

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      const email = { values };
      if (!err) {
        this.props.firebase
          .doPasswordReset(email)
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
      <Card title="Reset Password">
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
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(Form.create()(PasswordForgetFormBase));
export { PasswordForgetForm, PasswordForgetLink };
