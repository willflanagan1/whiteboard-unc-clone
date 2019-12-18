import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Row, Col, Card } from 'antd'
import { AuthUserContext } from '../Session';
import OfferingList from '../Offerings/OfferingList';
import { Layout, Button } from 'antd'
import OfferingItem from '../Offerings/OfferingItem'
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import { PayPalButton } from "react-paypal-button-v2";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        }
    }

    onRemoveItem = (id) => {
        var id;
        var i = 0;
        this.state.items.forEach((item) => {
            if (id === item.uid) {
                this.props.location.state.user.cart.splice(i, 1)
            }
            i++;
        }
        )
    }

   

    componentWillMount = () => {
        this.setState({ items: this.props.location.state.user.cart });
    }

    componentWillUnmount= () => {
        this.setState({ items: this.props.location.state.user.cart });
    }


    render() {
        var totalPrice = 0;
        console.log(this.state.items)
        if (this.state.items === undefined || this.state.items.length === 0) {
            return (
                <Row type="flex" align="top" justify="center" style={{ marginTop: 10, height: 700 }}>
                    <Col style={{ width: 1000 }}>
                        <Card title="My Cart">
                            <p>You have no items in your cart</p>
                        </Card>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row type="flex" align="top" justify="center" style={{ marginTop: 10, height: 700 }}>
                    <Col style={{ width: 1000 }}>
                        <Row>
                            <Card title="My Cart">
                                {this.state.items.map((cartItem) => {
                                    totalPrice = totalPrice + cartItem.price;
                                    return (

                                        <Row span={8} key={cartItem.uid}>
                                            <div>
                                                <p><strong>{cartItem.title}</strong></p>
                                                <p>Condition: {cartItem.condition}</p>
                                                <p>Price: ${cartItem.price}</p>
                                                <p>Posted by: {cartItem.authUser.email}</p>
                                            </div>
                                            <Link
                                            to={ROUTES.HOME}
                                            ><Button
                                            type="button"
                                            onClick={() => this.onRemoveItem(cartItem.uid)}
                                        >
                                            Delete
                                </Button></Link>
                                            <hr style={{ margin: 10 }}></hr>
                                        </Row>
                                    )})
                                }
                                 {console.log(totalPrice)}
                                 <p><strong>Total Price: ${totalPrice}</strong></p>
                                 <PayPal amount={totalPrice}>Buy Now</PayPal>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            )
        }

    };

}

class PayPal extends Component {
    render() {
        return (
            <PayPalButton
                amount={this.props.amount}
                onSuccess={(details, data) => {
                    alert("Transaction completed by " + details.payer.name.given_name);
                    // OPTIONAL: Call your server to save the transaction
                    return fetch("/paypal-transaction-complete", {
                        method: "post",
                        body: JSON.stringify({
                            orderID: data.orderID
                        })
                    });
                }}
            />
        );
    }
}


export default withFirebase(Cart);