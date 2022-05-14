import React, { Component } from 'react'

import UserStore from '../Store/UserStore'
import Axios from 'axios';
import { InputGroup, FormControl, CardDeck, Container, Button } from 'react-bootstrap';
import BookCard from '../components/BookCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ReactLoading from 'react-loading'



class Favoris extends Component {
    constructor(props) {
        super(props);
        this.state = {
          favoris: [],
          loading: true,
          search: '',
          errors : []
        }
    }

    removeFavoris = (idEbook, index, cb) => {
        Axios.post("http://localhost:8080/api/favoris/delete", {
            token : UserStore.userSession.token,
            data : {
              idEbook: idEbook
            }
        }).then((response) => {
            this.getFavoris()
        });
    }

    getFavoris = () => {
        Axios.post("http://localhost:8080/api/favoris/gets", {
            token: UserStore.userSession.token
        }).then((response) => {
            if (response.data.success) {
                this.setState({favoris : response.data.data, loading : false})
            } 
            this.setState({ loading : false}) 
        }).catch((err) => {
            console.error(err)
        });
    }

    componentDidMount() {
        this.getFavoris();
    }

    render() {

        if(this.state.loading) {
            return <div style={{
                margin: '20%'
            }}>
                <div className="col-2 mx-auto">
                    <ReactLoading type="spinningBubbles" color="#4921bd" width={"100%"}/>
                </div>
            </div>
        } else {
                let books = Object.values(this.state.favoris);
                return (
                    <Container className="mt-5">
                    
                    <InputGroup>
                        <FormControl
                        type="text"
                        placeholder="Input group example"
                        value={this.state.search}
                        onChange={(e)=>this.setState({search : e.target.value})}
                        />
                        <Button><FontAwesomeIcon icon={faSearch}/></Button>
                        </InputGroup>
                        <CardDeck className="mt-3">
                        {books.map((value, index) => {
                            if(this.state.search){
                                let tabBook = [ value.title, value.author, (new Date(value.date)).toLocaleDateString('fr-FR',{ year: 'numeric', month: '2-digit', day: '2-digit'})]
                                tabBook.concat(value.types.map((type)=>type.name))
                                tabBook.concat(value.key_words)
                                tabBook = tabBook.map((s)=>s.toLowerCase())

                                let searchWords = this.state.search.split(' ')

                                if(searchWords.map((s)=>s.toLowerCase()).filter(searchW => tabBook.find((elem)=>elem.includes(searchW))).length===searchWords.length){
                                    return (
                                        <BookCard removeFavoris={(idEbook, cb)=>this.removeFavoris(idEbook, index, cb)} addFavoris={(idEbook, cb)=>''} fav={1} book={value} key={index}></BookCard>
                                    );
                                }
                            }else{
                                return (
                                    <BookCard removeFavoris={(idEbook, cb)=>this.removeFavoris(idEbook, index, cb)} addFavoris={(idEbook, cb)=>''} fav={1} book={value} key={index}></BookCard>
                                );
                            }
                        })}
                        </CardDeck>
                    </Container>
                )
            
            
        }    
    }
       
}

export default Favoris;

