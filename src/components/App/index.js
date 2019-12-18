import React from 'react';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Cart from '../Cart';
import { OfferingPostForm, OfferingPage } from '../Offerings';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

import { Layout } from 'antd';

const App = () => (
  <Router>
    <Layout style={{ height: '100%' }}>
      <Navigation />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.OFFERING_DETAILS} component={OfferingPage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.POST_OFFERING} component={OfferingPostForm} />
      <Route path={ROUTES.CART} component={Cart} />
    </Layout>
  </Router>
);

export default withAuthentication(App);
