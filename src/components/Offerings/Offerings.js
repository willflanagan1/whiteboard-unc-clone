import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import OfferingList from './OfferingList';

class Offerings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      offerings: [],
      limit: 100,
    };
  }

  componentDidMount() {
    this.onListenForOfferings();
  }

  onListenForOfferings = () => {
    this.setState({ loading: true });

    const query = this.props.query ? this.props.query : '';

    this.unsubscribe = this.props.firebase
      .offerings()
      // .where('title', '>', query)
      // .where('title', '<', query+'z')
      // .orderBy('createdAt', 'desc')
      .limit(this.state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let offerings = [];
          snapshot.forEach(doc =>
            offerings.push({ ...doc.data(), uid: doc.id }),
          );

          this.setState({
            offerings: offerings.reverse(),
            loading: false,
          });
        } else {
          this.setState({ offerings: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateOffering = (event, authUser) => {
    this.props.firebase.offerings().add({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp(),
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  onEditOffering = (offering, text) => {
    const { uid, ...offeringSnapshot } = offering;

    this.props.firebase.offering(offering.uid).update({
      ...offeringSnapshot,
      text,
      editedAt: this.props.firebase.fieldValue.serverTimestamp(),
    });
  };

  onRemoveOffering = uid => {
    this.props.firebase.offering(uid).delete();
  };

  onRetrieveMore = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForOfferings,
    );
  };

  render() {
    const { offerings, loading } = this.state;

    var user = this.props.user

    if (user !== undefined) {
      console.log('yes')
      var copyOfferings = [];
      offerings.forEach((offering) => {
        console.log(offering);
        if(offering.authUser.uid===user) {
          copyOfferings.push(offering)
        }
      })
      return (
        <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h3>Your Listings:</h3>
            {loading && <div>Loading ...</div>}

            {offerings && (
              <OfferingList
                authUser={authUser}
                offerings={copyOfferings}
                onEditOffering={this.onEditOffering}
                onRemoveOffering={this.onRemoveOffering}
              />
            )}

            {!offerings && <div>No items found!</div>}
          </div>
        )}
        </AuthUserContext.Consumer>
      )
    }
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading && <div>Loading ...</div>}

            {offerings && (
              <OfferingList
                authUser={authUser}
                offerings={offerings}
                onEditOffering={this.onEditOffering}
                onRemoveOffering={this.onRemoveOffering}
              />
            )}

            {!offerings && <div>No items found!</div>}
          </div>
        )}
        </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Offerings);
