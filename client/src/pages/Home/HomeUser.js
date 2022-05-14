/* eslint-disable no-lone-blocks */
import React, {Component} from 'react'
import ReactLoading from 'react-loading'

import UserStore from '../../Store/UserStore'
import Axios from 'axios';
import {
    InputGroup,
    FormControl,
    CardDeck,
    Container,
    Button,
    ButtonGroup,
    Form
} from 'react-bootstrap';
import BookCard from '../../components/BookCard';
import MonthBook from '../../components/MonthBook';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBroom } from '@fortawesome/free-solid-svg-icons';

import ReactStars from 'react-stars';

class HomeUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            favoris: [],
            loading: true,
            search: '',
            errors: [],
            starsNote: -1,
            starsFunctionId: -1
        }
        this.starsFunction = [
            (avg) => avg >= this.state.starsNote,
            (avg) => avg <= this.state.starsNote
        ]
    }

    componentDidMount() {
        this.getBooks();
    }

    getBooks = () => {
        Axios
            .post("http://localhost:8080/api/ebook/gets", {token: UserStore.userSession.token})
            .then((response) => {
                if (response.data.success) {
                    this.setState({books: response.data.data})
                    this.getfavoris();
                }
            });
    }

    getfavoris = () => {
        Axios
            .post("http://localhost:8080/api/favoris/gets", {token: UserStore.userSession.token})
            .then((response) => {
                if (response.data.success) {
                    this.setState({favoris: response.data.data})
                }
                this.compareFav();
            });
    }

    compareFav = () => {
        let idsFavoris = this
            .state
            .favoris
            .map((favoris) => favoris.id)
        let newBooks = [...this.state.books]

        newBooks.forEach((books) => {
            if (idsFavoris.includes(books.id)) {
                books.fav = 1
            } else {
                books.fav = 0
            }

            if (newBooks[newBooks.length - 1] === books) {
                this.setState({books: newBooks, loading: false})
            }

        })
    }

    addFavoris = (idEbook, cb) => {
        Axios
            .post("http://localhost:8080/api/favoris/add", {
            token: UserStore.userSession.token,
            data: {
                idEbook: idEbook
            }
        })
            .then((response) => {
                cb(response.data)
            });
    }

    removeFavoris = (idEbook, cb) => {
        Axios
            .post("http://localhost:8080/api/favoris/delete", {
            token: UserStore.userSession.token,
            data: {
                idEbook: idEbook
            }
        })
            .then((response) => {
                cb(response.data)
            });
    }

    render() {
        if (this.state.loading) {
            return <div style={{
                margin: '20%'
            }}>
                <div className="col-2 mx-auto">
                    <ReactLoading type="spinningBubbles" color="#4921bd" width={"100%"}/>
                </div>
            </div>
        } else {
            let books = Object.values(this.state.books);
            let monthBook = <MonthBook book={books[0]} removeFavoris={(idEbook, cb)=>this.removeFavoris(idEbook, cb)} addFavoris={(idEbook, cb)=>this.addFavoris(idEbook, cb)}></MonthBook>

            if(this.state.search || (this.state.starsFunctionId!=-1 && this.state.starsNote!=-1 )){
                monthBook = <div></div>
            }
            return (

                <Container className="mt-5">
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Recherche..."
                            value={this.state.search}
                            onChange={(e) => this.setState({search: e.target.value})}/>
                        <p
                            style={{
                            margin: "5px"
                        }}>Plus</p>
                        <Form.Check
                            style={{
                            margin: "-5px 0 0 5px",
                            width: "40px"
                        }}
                            type="radio"
                            name="RadioButton"
                            onChange={() => this.setState({starsFunctionId: 0, starsNote: -1})}/>
                        <p
                            style={{
                            margin: "5px"
                        }}>Moins</p>
                        <Form.Check
                            style={{
                            margin: "-5px 0 0 5px",
                            width: "40px"
                        }}
                            type="radio"
                            name="RadioButton"
                            onChange={() => this.setState({starsFunctionId: 1, starsNote: -1})}/>
                        <ReactStars
                            count={5}
                            onChange={e => {
                            this.setState({starsNote: e});
                        }}
                            value={parseFloat(this.state.starsNote)}
                            size={24}
                            color2={'#3200C4'}/>

                        <Button
                            style={{
                            marginLeft: "10px",
                            height: "100%"
                        }}
                            variant='danger' onClick={()=>this.setState({starsFunctionId : -1, starsNote : -1, search : ''})}><FontAwesomeIcon icon={faBroom} /></Button>

                    </InputGroup>

                    {monthBook}
                    <CardDeck>
                        {books.map((value, index) => {
                            if(this.state.search || (this.state.starsFunctionId!=-1 && this.state.starsNote!=-1 )){
                                let tabBook = [ value.title, value.author, (new Date(value.date)).toLocaleDateString('fr-FR',{ year: 'numeric', month: '2-digit', day: '2-digit'})]
                                tabBook.concat(value.types.map((type)=>type.name))
                                tabBook.concat(value.key_words)
                                tabBook = tabBook.map((s) => s.toLowerCase())

                                let searchWords = this
                                    .state
                                    .search
                                    .split(' ')

                                if (searchWords.map((s) => s.toLowerCase()).filter(searchW => tabBook.find((elem) => elem.includes(searchW))).length === searchWords.length) {
                                    if (this.state.starsFunctionId != -1 && this.state.starsNote != -1 && value.avgStars != null && !this.starsFunction[this.state.starsFunctionId](value.avgStars)) {
                                        return
                                    }
                                    return (
                                        <BookCard
                                            removeFavoris={(idEbook, cb) => this.removeFavoris(idEbook, cb)}
                                            addFavoris={(idEbook, cb) => this.addFavoris(idEbook, cb)}
                                            fav={value.fav}
                                            book={value}
                                            key={index}></BookCard>
                                    );
                                }
                            } else {
                                return (
                                    <BookCard
                                        removeFavoris={(idEbook, cb) => this.removeFavoris(idEbook, cb)}
                                        addFavoris={(idEbook, cb) => this.addFavoris(idEbook, cb)}
                                        fav={value.fav}
                                        book={value}
                                        key={index}></BookCard>
                                );
                            }
                        })}
                    </CardDeck>
                </Container>
            )
        }
    }
}

export default HomeUser;
