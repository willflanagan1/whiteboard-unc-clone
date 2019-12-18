import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import SearchBar from '../SearchBar';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import logo from './whiteboardlogo-0.png';
import { AuthUserContext } from '../Session';
import { Layout, Menu, Row, Col, Button, Affix } from 'antd';
import { withFirebase } from '../Firebase'



const { Header } = Layout;
const value = '';

const handleSelect = (value) => {
  value = value;
}


class GoToSelected extends Component {
  constructor(props){
    super(props);
    this.state = {
      chosenDoc: {},
    }
  }
  render() {
    return (
      <Link to={{
        pathname: ROUTES.OFFERING_DETAILS + this.state.chosenDoc.uid,
        state: {
          offering: this.state.chosenDoc,
        }
      }
      } ></Link>
    )
  }
}


const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
          <NavigationNonAuth />
        )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <Header style={{ background: '#fff', padding: 0, }}>
    <Row>
      <Col span={4} >
        <Link to={ROUTES.HOME}><img style={{ marginTop: -26, marginLeft: 18 }} alt='whiteboard-unc' key='1' src={logo}></img></Link>
      </Col>
      <Col span={12}>
        <SearchBar handleSelect={()=>handleSelect(value)}><Button>go</Button></SearchBar>
      </Col>
      <Col span={8}>
        <Row type="flex" justify="end">
          <Col span={20}>
            <Link to={ROUTES.POST_OFFERING}>
              <Button type="primary" shape="circle" icon="plus">
              </Button>
            </Link>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px', float: 'right' }}
            >
              {!!authUser.roles[ROLES.ADMIN] && (
                <Menu.Item key="2">
                  <Link to={ROUTES.ADMIN}>Admin</Link>
                </Menu.Item>
              )}
              <Menu.Item key="3">
                <Link to={{
                  pathname: ROUTES.CART,
                  state: {
                    user: authUser,
                  }
                }}
                >Cart</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to={ROUTES.ACCOUNT}>Account</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <SignOutButton />
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Col>
    </Row>
  </Header>
);

const NavigationNonAuth = () => (
  <Affix>
    <Menu
      mode="horizontal"
      defaultSelectedKeys={['1']}
      style={{ lineHeight: '64px' }}
    >
      <Menu.Item key="1">
        <Link to={ROUTES.LANDING}><img style={{ marginTop: -29, marginLeft: -25, marginBottom: -18 }} alt='whiteboard-unc' key='1' src={logo}></img></Link>
      </Menu.Item>
      <Menu.Item key="3" style={{ float: 'right' }}>
        <Link to={ROUTES.SIGN_UP}>Register</Link>
      </Menu.Item>
      <Menu.Item key="2" style={{ float: 'right' }}>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </Menu.Item>
    </Menu>
  </Affix>
);


export default withFirebase(Navigation);
