import React, {Component} from 'react'
import {Link} from 'react-router-dom';

import {Col, Card, Button, Row} from 'react-bootstrap';

import ReactStars from 'react-stars';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt, faStar} from '@fortawesome/free-solid-svg-icons';

class BookCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: this.props.book,
            fav: this.props.fav,
            more: ''
        }
    }

    addFavoris = (idEbook) => {
        this
            .props
            .addFavoris(idEbook, rslt => {
                this.setState({fav: 1});
            })
    }

    removeFavoris = (idEbook) => {
        this
            .props
            .removeFavoris(idEbook, rslt => {
                this.setState({fav: 0});
            })
    }

    render() {

        let book = this.state.book;

        let cta = '';

        if (this.state.fav === 0) {
            cta = <Button
                variant='warning'
                style={{
                color: "#fff",
                position: 'relative',
                zIndex: "2",
                left: "185px",
                top: "50px"
            }}
                onClick={(e) => {
                this.addFavoris(book.id)
            }}><FontAwesomeIcon icon={faStar}/></Button>
        } else if (this.state.fav === 1) {
            cta = <Button
                variant='danger'
                style={{
                position: 'relative',
                zIndex: "2",
                left: "185px",
                top: "50px"
            }}
                onClick={(e) => {
                this.removeFavoris(book.id)
            }}><FontAwesomeIcon icon={faTrashAlt}/></Button>
        };


        return (
            <Col
                sm={6}
                lg={3}
                className="mb-3"
                style={{
                width: "100%"
            }}
                onMouseEnter={() => {
                  this.setState({more:  <div>
                    <p className="my-auto mt-2">{book.author}</p>
                    <p className="mx-auto"><ReactStars
                    style={{margin: "0"}}
                    count={5}
                    value={parseFloat(book.avgStars)}
                    edit={false}
                    size={20}
                    color2={'#3200c4'} /></p>
                    </div>
                  })
                }}
                onMouseLeave={() => {
                  console.log('test')
                  this.setState({more: ""})
                }}>
                  
                {cta}

                <Card
                    className="card-book home"
                    style={{
                    borderRadius: "1rem"
                }}>
                    <Card.Img src={book.img} alt="Card image"/>
                    <Link to={'/Book/' + book.id}>
                        <Card.ImgOverlay/>
                    </Link>

                    <Card.Body style={{textAlign: "center", padding:"auto"}}>
                        <p>{book.title}</p>
                        <p>{this.state.more}</p>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default BookCard;
