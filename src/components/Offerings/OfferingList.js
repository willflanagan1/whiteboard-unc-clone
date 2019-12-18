import React from 'react';

import OfferingItem from './OfferingItem';

import { Col, Row } from 'antd';

const OfferingList = ({
  authUser,
  offerings,
  onEditOffering,
  onRemoveOffering,
}) => (
  <Row type="flex" gutter={[32, 32]}>
    {offerings.map(offering => (
      <Col span={8} key={offering.uid}>
        <OfferingItem
          authUser={authUser}
          key={offering.uid}
          offering={offering}
          onEditOffering={onEditOffering}
          onRemoveOffering={onRemoveOffering}
        />
      </Col>
    ))}
  </Row>
);

export default OfferingList;
