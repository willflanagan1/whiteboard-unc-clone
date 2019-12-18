import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

import { PASSWORD_VALIDATION_RULES } from '../../constants/validation';

import { Form, Icon, Input, Button, Card } from 'antd';

class PasswordChangeForm extends Component {

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
        const { passwordOne } = values;
        this.props.firebase
          .doPasswordUpdate(passwordOne)
          .catch(error => {
            console.log(error.message);
          });
      } else {
        console.log(err);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="Change Password">
        <Form onSubmit={this.handleSubmit}>
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
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default withFirebase(Form.create()(PasswordChangeForm));
