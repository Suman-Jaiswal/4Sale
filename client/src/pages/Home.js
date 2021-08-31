import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react';
import axios from 'axios';
import Deck from '../components/Deck';
import HomeSvg from '../svgs/HomeSvg';
import Spinner from '../components/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketballBall, faBook, faGamepad, faReceipt, faShoppingCart, faSplotch } from '@fortawesome/free-solid-svg-icons';
import NOT_FOUND from './Not_Found';

class Home extends Component {

    state = {
        loading: true,
        error: false,
        allItems: [
            // {
            // _id: '',
            // title: '',
            // price: '',
            // date: ''

            // }
        ],
        Sports: [

        ],
        Books: [

        ],
        Games: [

        ],
        Utilities: [

        ],
        Other: [

        ]
    }

    componentDidMount() {
    
        axios.get('/api/items')
            .then(res => {
                this.setState({
                    ...this.state,
                    allItems: res.data.splice(0, 8),
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    error: true,
                    loading: false
                })
            })
        axios.get(`/api/items/filter?categories=Sports`)
            .then(res => {
                this.setState({
                    ...this.state,
                    Sports: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    error: true,
                    loading: false
                })
            })
        axios.get(`/api/items/filter?categories=Books`)
            .then(res => {
                this.setState({
                    ...this.state,
                    Books: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    error: true,
                    loading: false
                })
            })
        axios.get(`/api/items/filter?categories=Games`)
            .then(res => {
                this.setState({
                    ...this.state,
                    Games: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    error: true,
                    loading: false
                })
            })
        axios.get(`/api/items/filter?categories=Utilities`)
            .then(res => {
                this.setState({
                    ...this.state,
                    Utilities: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    error: true,
                    loading: false
                })
            })
        axios.get(`/api/items/filter?categories=Other`)
            .then(res => {
                this.setState({
                    ...this.state,
                    Other: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    error: true,
                    loading: false
                })
            })
    }

    render() {
        console.log('call')
        const { allItems, Sports, Books, Games, Utilities, Other, loading, error } = this.state;
        const update = (id) => {
            this.setState({
                ...this.state,
                allItems: allItems.filter(item => item._id !== id),
                Sports: Sports.filter(item => item._id !== id),
                Books: Books.filter(item => item._id !== id),
                Games: Games.filter(item => item._id !== id),
                Utilities: Utilities.filter(item => item._id !== id),
                Other: Other.filter(item => item._id !== id)
            });
        };

        return (
            <>
                <div className='container-fluid d-flex justify-content-around mb-4 ' style={{
                    height: '30vw', backgroundColor: '#fff',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/always-grey.png")'
                }} >
                    <div className="d-flex flex-column" style={{ width: '55vw', padding: '20px 10px' }}>
                        <h1 className="" style={{ fontSize: '5vw', fontWeight: 'bold' }} >Every Purchase will be made with pleasure.</h1>
                        <p style={{ fontSize: '3vw' }} >Login with Institute Id.</p>
                    </div>
                    <HomeSvg />
                </div>
                {
                    loading ? <Spinner /> : error === false ?
                        <section className='container-fluid' >
                            <div style={{ minHeight: '300px' }} className='container py-3 bg-light' >
                                <div className='py-2 bg-secondary text-warning container' style={{ borderBottom: '0.5px dotted grey', borderRadius: '10px 10px 0 0' }} >
                                    <h4 className='text-center mb-0' ><b><FontAwesomeIcon icon={faReceipt} /> Recently Added</b></h4>
                                </div>
                                <div className='container' >
                                    <Deck items={allItems} update={update} removeFav={false} removeSold={true} />
                                </div>
                            </div>


                            <div style={{ minHeight: '300px' }} className='container py-3 bg-light' >
                                <div className='py-2 bg-secondary text-warning container' style={{ borderBottom: '0.5px dotted grey', borderRadius: '10px 10px 0 0' }} >
                                    <h4 className='text-center mb-0' ><b><FontAwesomeIcon icon={faBasketballBall} /> Sports</b></h4>
                                </div>
                                <div className='container' >
                                    <Deck items={Sports} update={update} removeFav={false} removeSold={true} />
                                </div>
                            </div>


                            <div style={{ minHeight: '300px' }} className='container py-3 bg-light' >
                                <div className='py-2 bg-secondary text-warning container' style={{ borderBottom: '0.5px dotted grey', borderRadius: '10px 10px 0 0' }} >
                                    <h4 className='text-center mb-0' ><b><FontAwesomeIcon icon={faBook} /> Books</b></h4>
                                </div>
                                <div className='container' >
                                    <Deck items={Books} update={update} removeFav={false} removeSold={true} />
                                </div>
                            </div>


                            <div style={{ minHeight: '300px' }} className='container py-3 bg-light' >

                                <div className='py-2 bg-secondary text-warning container' style={{ borderBottom: '0.5px dotted grey', borderRadius: '10px 10px 0 0' }} >
                                    <h4 className='text-center mb-0' ><b><FontAwesomeIcon icon={faGamepad} /> Games</b></h4>
                                </div>
                                <div className='container' >
                                    <Deck items={Games} update={update} removeFav={false} removeSold={true} />
                                </div>
                            </div>


                            <div style={{ minHeight: '300px' }} className='container py-3 bg-light' >

                                <div className='py-2 bg-secondary text-warning container' style={{ borderBottom: '0.5px dotted grey', borderRadius: '10px 10px 0 0' }} >
                                    <h4 className='text-center mb-0' ><b><FontAwesomeIcon icon={faSplotch} /> Utilities</b></h4>
                                </div>
                                <div className='container' >
                                    <Deck items={Utilities} update={update} removeFav={false} removeSold={true} />
                                </div>
                            </div>


                            <div style={{ minHeight: '300px' }} className='container py-3 bg-light' >

                                <div className='py-2 bg-secondary text-warning container' style={{ borderBottom: '0.5px dotted grey', borderRadius: '10px 10px 0 0' }} >
                                    <h4 className='text-center mb-0' ><b><FontAwesomeIcon icon={faShoppingCart} /> Others</b></h4>
                                </div>
                                <div className='container' >
                                    <Deck items={Other} update={update} removeSold={true} removeFav={false} />
                                </div>
                            </div>
                        </section> :
                        <NOT_FOUND />
                }

            </>
        )
    }
}

export default Home;
