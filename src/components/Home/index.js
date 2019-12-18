import React from 'react';
import { compose } from 'recompose';
import { withAuthorization, withEmailVerification } from '../Session';
import Offerings from '../Offerings';

import { Layout, Breadcrumb, Row, Col } from 'antd';
import Sidenav from './Sidenav';
const { Content } = Layout;

const HomePage = () => (
  <Row>
    <Col span={4}>

      <Sidenav />
    </Col>
    <Col span={20}>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><strong>Market</strong></Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Offerings />
        </Content>
      </Layout>
    </Col>
  </Row>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
