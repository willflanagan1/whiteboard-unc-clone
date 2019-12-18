import './offerings.css'
import { AuthUserContext } from '../Session'
import { withFirebase } from '../Firebase'

import React, { Component } from 'react';
import { Layout, Button, Row } from 'antd';
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
const { Header, Footer, Sider, Content } = Layout;



class OfferingPageBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: this.props.imgUrls,
        }
    }

    handleAddToCart = (authUser) => {
        if(authUser.cart === undefined) {
            authUser.cart = [];
            authUser.cart[0]=(this.props.offering);
        }else {
            authUser.cart.push(this.props.offering);
        }
    }
    render() {
        const offering = this.props.offering;
        if (this.state.urls.length === 1 || this.state.urls.length === 0) {
            return (
                <Row style={{height:700}}>
                <AuthUserContext.Consumer>
                    {authUser => (
                    <div justify="center" style={{ marginTop: "5px" }}>
                        <Layout style={{ padding: "30px", width: "1000px", marginLeft: "150px" }}>
                            <Layout style={{borderStyle:"solid", borderWidth:"1",borderRadius:10, background: "white", marginRight:10  }}>
                                <Header
                                    style={{
                                        background: 'white',
                                        fontSize: 25
                                    }}
                                >{offering.title.toUpperCase()}</Header>
                                <Content
                                    style={{
                                        background: 'white',
                                        padding: 24,
                                        marginLeft:26,
                                        marginTop:-10
                                    }}
                                >

                                    <div>
                                        <p><strong style={{color:'#002b54'}}>Description:   </strong>{offering.description}</p>
                                        <p><strong style={{color:'#002b54'}}>Condition:   </strong>{offering.condition}</p>
                                        <p><strong style={{color:'#002b54'}}>Price:   </strong>${offering.price}</p>
                                        <p><strong style={{color:'#002b54'}}>Posted by:   </strong>{offering.authUser.email}</p>
                                    </div>
                                </Content>
                                <Footer
                                    style={{
                                        background: "white",
                                        paddingLeft: 400
                                    }}>
                                    <Button type="primary" onClick={()=>this.handleAddToCart(authUser)}>
                                        Add to Cart
                                    </Button>
                                </Footer>
                            </Layout>
                            <Sider>
                                <img alt='Contact seller for pictures' style={{ maxHeight: 500, maxWidth: 500 }} key={0} src={this.state.urls[0]}></img>
                            </Sider>
                        </Layout>
                    </div>)}
                </AuthUserContext.Consumer>
                </Row>
            )
        } else {
            return (
                <AuthUserContext>
                    {authUser=>(
                    <div style={{ marginTop: "5px" }}>
                        <Layout style={{  padding: "30px", width: "1000px", marginLeft: "100px" }}>
                            <Layout style={{borderStyle:"solid", borderWidth:"1",
                                borderRadius:10, background: "white", marginRight:10 }}>
                                <Header
                                    style={{
                                        background: 'white',
                                        fontSize: 25
                                    }}
                                ><h1>{offering.title.toUpperCase()}</h1></Header>
                                <Content
                                    style={{
                                        background: 'white',
                                        padding: 24,
                                        marginLeft:26,
                                        marginTop:-10
                                    }}
                                >
                                    <div>
                                    <p><strong style={{color:'#002b54'}}>Description:   </strong>{offering.description}</p>
                                        <p><strong style={{color:'#002b54'}}>Condition:   </strong>{offering.condition}</p>
                                        <p><strong style={{color:'#002b54'}}>Price:   </strong>${offering.price}</p>
                                        <p><strong style={{color:'#002b54'}}>Posted by:   </strong>{offering.authUser.email}</p>
                                    </div>
                                </Content>
                                <Footer
                                    style={{
                                        background: "white",
                                        paddingLeft: 400
                                    }}>
                                    <Button type="primary" onClick={()=>this.handleAddToCart(authUser)}>
                                        Add to Cart
                                </Button>
                                </Footer>
                            </Layout>
                            <Sider>
                                <Gallery urls={this.state.urls} />
                            </Sider>
                        </Layout>
                    </div>
                    )}
                </AuthUserContext>
            );
        }
    }
}

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            currentIndex: 0,
        }
    }

    componentWillMount = () => {
        var index = this.state.currentIndex;
        this.props.urls.forEach((url) => {
            this.state.images.push(<img alt="Contact Seller for Pictures" style={{ maxHeight: 500, maxWidth: 400 }} key={index} src={this.props.urls[index]}></img>)
            index++;
        });
        this.setState({ currentIndex: index });
    }

    slideTo = (i) => this.setState({ currentIndex: i })

    onSlideChanged = (e) => this.setState({ currentIndex: e.item })

    slideNext = () => this.setState({ currentIndex: this.state.currentIndex + 1 })

    slidePrev = () => this.setState({ currentIndex: this.state.currentIndex - 1 })

    thumbItem = (item, i) => <span onClick={() => this.slideTo(i)}></span>

    render() {
        console.log(this.state.images)
        return (
            <div>
                <AliceCarousel
                    dotsDisabled={true}
                    buttonsDisabled={true}
                    items={this.state.images}
                    ref={(el) => (this.Carousel = el)}
                />

                <nav>{this.state.images.map(this.thumbItem)}</nav>
                <div style={{ textAlign: "center" }}>
                    <Button style={{ position: "absolute", top: 15, right: 520 }} onClick={() => this.Carousel.slidePrev()}>Prev Pic</Button>
                    <Button style={{ position: "absolute", top: 15, right: 430 }} onClick={() => this.Carousel.slideNext()}>Next Pic</Button>
                </div>
            </div>
        )
    }
}


class OfferingPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { offering } = this.props.location.state;
        return <OfferingPageBase offering={offering} imgUrls={offering.imgUrls} />;
    }
}

export default withFirebase(OfferingPage);
