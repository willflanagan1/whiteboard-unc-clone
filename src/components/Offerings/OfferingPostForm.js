import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { CONDITIONS } from '../../constants/conditions'

import { withFirebase } from '../Firebase';
import FileUploader from "react-firebase-file-uploader";

import { Form, Input, Col, Row, Card, Select, InputNumber, Button, Icon, Alert } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

class NewOffering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorySelected: '',
      canPost: false,
      files: [],
      filenames: [],
      downloadURLs: [],
      isUploading: false,
      uploadProgress: 0,
      numOfPics: 0,
    }
  }

  handleUploadStart = () => {
    this.setState({
      isUploading: true,
      uploadProgress: 0
    });
  }



  handleUploadSuccess = async filename => {
    const downloadURL = await this.props.firebase
      .storage
      .ref("images")
      .child(filename)
      .getDownloadURL();
    this.setState(oldState => ({
      downloadURLs: [...oldState.downloadURLs, downloadURL],
      filenames: [...oldState.filenames, filename],
      uploadProgress: 100,
      isUploading: false,
      numOfPics: ++oldState.numOfPics,
    }));
  };

  onSubmit = (event, authUser) => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { getFieldsValue } = this.props.form;
        const { title, condition, price, description } = getFieldsValue(['title', 'condition', 'price', 'description']);
        this.props.firebase.offerings().add({
          title: title,
          condition: condition,
          imgUrls: this.state.downloadURLs,
          price: price,
          description: description,
          authUser: authUser,
          createdAt: this.props.firebase.fieldValue.serverTimestamp(),
        }).then(() =>
          this.props.history.push(ROUTES.HOME)
        );
      } else {
        console.log(err)
      }
    });
  }



  handleChange = (value) => {
    console.log(value);
    this.setState({
      categorySelected: CONDITIONS[value],
    });
  }
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 15 },
      }
    };

    const config = {
      rules: [{ required: true, message: 'Please fill out all required fields!' }]
    }

    return (
      <AuthUserContext.Consumer >
        {authUser => (
          <Row type="flex" align="top" justify="center" style={{ marginTop: 10, height: 700 }}>
            <Col style={{ width: 1000 }}>
              <Card title="Create your listing">
                <Form {...formItemLayout} onSubmit={(event) => this.onSubmit(event, authUser)}>
                  <Form.Item label="Title">
                    {getFieldDecorator('title', config)(
                      <Input name="title" />)}
                  </Form.Item>
                  <Form.Item label="Condition">
                    {getFieldDecorator('condition', config)(
                      <Select onChange={this.handleChange}>
                        <Option value='NEW'>New</Option>
                        <Option value='OPENBOX'>Open Box</Option>
                        <Option value='USED'>Used</Option>
                        <Option value='FORPARTS'>For parts or not working</Option>
                      </Select>)}
                    <div>{this.state.categorySelected}</div>
                  </Form.Item>
                  <Form.Item label="Price">
                    <div>
                      {getFieldDecorator('price', config)(
                        <InputNumber
                          name='price'
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />)}
                    </div>
                  </Form.Item>
                  <Form.Item label={"Upload Pictures (" + this.state.numOfPics + "/4)"}>
                    {this.state.isUploading && <p>Progress: {this.state.progress}%</p>}
                    <label style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer' }}>
                      <Icon style={{ marginTop: 10, fontSize: 20, marginBottom: 15 }} type="upload"></Icon>
                      <FileUploader
                        hidden
                        accept="image/*"
                        name="itemImage"
                        randomizeFilename
                        storageRef={this.props.firebase.storage.ref("images")}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                        multiple
                      />
                    </label>
                    <div>
                      {this.state.downloadURLs.map((downloadURL, i) => {
                        return <img alt='img' style={{ maxHeight: "150px", float: 'left', margin:2 }} key={i} src={downloadURL} />;
                      })}
                    </div>
                  </Form.Item>
                  <Form.Item label="Additional Description">
                    {getFieldDecorator('description')(<TextArea name="description" />)}
                  </Form.Item>
                  <Form.Item style={{ marginLeft: '690px' }}>
                    <Button type="primary" htmlType="submit">
                      Post
                </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row >
        )
        }
      </AuthUserContext.Consumer >
    );
  }
}

const OfferingPostForm = compose(
  withRouter,
  withFirebase,
)(Form.create()(NewOffering));

export default OfferingPostForm;