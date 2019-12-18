import React, { Component } from 'react';
import { debounce } from 'throttle-debounce';
import OfferingItem from '../Offerings/OfferingItem'

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';

import { AutoComplete, Button } from 'antd';
import { OfferingPage, OfferingPostForm } from '../Offerings';
import OfferingList from '../Offerings/OfferingList';

const { Option } = AutoComplete;


class SearchBar extends Component {
  state = {
    resultOfferings: [],
    loading: false,
    chosenDoc: {}
  };

  handleChange = debounce(500, async value => {
    this.setState({ loading: true });
    const firebase = this.props.firebase;

    let resultOfferings;

    if (!value) {
      this.setState({ resultOfferings: [], loading: false });
    } else {
      this.unsubscribe = firebase
        .offerings()
        .where('title', '>', value)
        .where('title', '<', value + 'z')
        .limit(5)
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            resultOfferings = [];
            snapshot.forEach(doc =>
              resultOfferings.push({ ...doc.data(), uid: doc.id }),
            );
            this.setState({
              resultOfferings: resultOfferings.reverse(),
              loading: false,
            });
          } else {
            this.setState({ resultOfferings: [], loading: false });
          }
        });
    }
  });

 

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { resultOfferings } = this.state;
    const children = resultOfferings.map(offering => <Option key={offering.uid} onClick={this.props.onSearch}>{offering.title}</Option>);
    return (
      <div>
        <AutoComplete
          style={{ width: '100%' }}
          placeholder="Search..."
          onChange={this.handleChange}
          onSelect={(value) => this.props.handleSelect(value)}
        >
          {children}
        </AutoComplete>
      </div>
    );
  }
}

export default withFirebase(SearchBar);
