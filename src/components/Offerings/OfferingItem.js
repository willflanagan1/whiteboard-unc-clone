import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { Card, Icon, Affix, Tag } from 'antd';
import './offerings.css'

const { Meta } = Card;


class OfferingItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.offering.text
    };
  }



  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.offering.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditOffering(this.props.offering, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, offering, onRemoveOffering } = this.props;
    const { editMode, editText } = this.state;
    const imgUrls = offering.imgUrls ? offering.imgUrls : [];
    return (
      <Link
        to={{
          pathname: ROUTES.OFFERING_DETAILS + this.props.offering.uid,
          state: {
            offering: offering,
          }
        }
        }
      >
        <div id="box" style={{
          cursor: 'pointer',
          color: "black"
      }}>
          <Tag
          color="red"
          style={{
            position: 'absolute',
            zIndex: 99,
            fontSize: 20
          }}
        >
          {offering.condition}
        </Tag>
        <Card
          style={{
            height: '600px',
          }}
          cover={
            <img
              alt="Cover"
              src={imgUrls[0]}
              style={{
                height: '330px',
                borderStyle: 'solid',
                borderWidth: 3
              }}
            />
          }
        >
          <Meta
            title={offering.title}
            description={offering.description}
          />
          {editMode ? (
            <input
              type="text"
              value={editText}
              onChange={this.onChangeEditText}
            />
          ) : (
              <span>
                {offering.editedAt && <span>(Edited)</span>}
              </span>
            )}

          {authUser.uid === offering.uid && (
            <span>
              {editMode ? (
                <span>
                  <button onClick={this.onSaveEditText}>Save</button>
                  <button onClick={this.onToggleEditMode}>Reset</button>
                </span>
              ) : (
                  <button onClick={this.onToggleEditMode}>Edit</button>
                )}

              {!editMode && (
                <button
                  type="button"
                  onClick={() => onRemoveOffering(offering.uid)}
                >
                  Delete
                </button>
              )}
            </span>
          )}
        </Card>
        </div>
      </Link >
    );
  }
}

export default OfferingItem;
