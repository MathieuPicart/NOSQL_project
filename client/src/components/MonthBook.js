import React, {Component} from 'react'
import {Col, Card, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactStars from 'react-stars';

class BookCardInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: this.props.book,
            fav: this.props.fav
        }
    }

    componentDidMount() {
        console.log(this.props.book);
    }

    render() {

        let book = this.state.book
        let types = Object.values(book.types)
        let key_words = Object.values(book.key_words)

        let date = (new Date(book.date)).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return (

            <Card className="mb-2 mt-3">
                <h2 class="ml-5 mt-3">Livre du moment !
                </h2>
                <Row className="mb-3">
                    <Col md={4}>
                        <Card.Img
                            src={book.img}
                            style={{
                            width: "200px",
                            height: "auto",
                            margin: "30px 60px 0 100px",
                        }}/>
                    </Col>
                    <Col
                        md={{
                        span: 6,
                        offset: 1
                    }}>
                        <Card.Body>
                            <Card.Title
                                style={{
                                paddingRight: "50px"
                            }}>
                                <Row
                                    style={{
                                    justifyContent: "space-between"
                                }}>
                                    <div>{book.title} - {book.author}</div>
                                    <ReactStars
                                        count={5}
                                        value={parseFloat(book.avgStars)}
                                        edit={false}
                                        size={20}
                                        color2={'#3200c4'}/></Row>
                            </Card.Title>
                            <Card.Text>
                                <Row
                                    style={{
                                    textAlign: "justify",
                                    margin: "2em 0 5em"
                                }}>{book.summary}</Row>
                            </Card.Text>
                            <Row
                                style={{
                                justifyContent: "space-around"
                            }}>
                                <Link to={'/Book/'+book.id}><Button >Voir le livre</Button></Link>
                            </Row>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default BookCardInformation;
