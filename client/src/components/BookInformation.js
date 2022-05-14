import React, {Component} from 'react'
import {Col, Card, Row} from 'react-bootstrap';

class BookCardInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: this.props.book
        }
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

            <Card style={{
                position: "fixed", width: "482px", marginTop: "-40px"
            }}>
                <Card.Img
                    src={book.img}
                    style={{
                    width: "360px",
                    height: "auto",
                    margin: "30px 60px 0 60px"
                }}/>
                <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>
                        <Row>
                            <Col>Auteur :</Col>
                            <Col>{book.author}</Col>
                        </Row>
                        <Row>
                            <Col>Date de parution :</Col>
                            <Col>{date}</Col>
                        </Row>
                        <Row>
                            <Col>Type / Genre :</Col>
                            <Col>
                                {types.map((value, index) => {
                                    return (
                                        <span>{value.name + " "}
                                        </span>
                                    );
                                })}
                            </Col>
                        </Row>
                        <Row>
                            <Col>Mots clé :</Col>
                            <Col>
                                {key_words.map((value, index) => {
                                    return (
                                        <span>{value + " "}
                                        </span>
                                    );
                                })}
                            </Col>
                        </Row>
                        <Row>
                            <Col>Résumé : 
                            <p style={{textAlign: "justify"}}>{book.summary}</p>
                            </Col>
                            </Row>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default BookCardInformation;
