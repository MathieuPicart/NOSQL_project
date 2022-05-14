import React, { Component } from 'react'
import UserStore from '../Store/UserStore'
import Axios from 'axios';
import { Col, Button, CardDeck, Container, Row, Modal, Alert } from 'react-bootstrap';
import PressComment from '../components/PressComment';
import UserComment from '../components/UserComment';
import BookInformation from '../components/BookInformation';
import ModalUpdateBook from '../components/ModalUpdateBook';
import ModalAddCommentUser from '../components/ModalAddCommentUser';
import BookReader from '../pages/BookReader';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      book: '',
      showBtnComment: true,
      showModalUpdate: false,
      showModalComment: false,
      showModalRead: false,
      loading: true
    }
  }

  getBook = () => {
    Axios.post("http://localhost:8080/api/ebook/getData", {
      token: UserStore.userSession.token,
      data : { idEbook : parseInt(this.state.id) }
    }).then((response) => {
      this.setState({book : response.data.data, loading : false})
      {this.state.book.user_comments.map((value, index) => {
        if(value.idUser == UserStore.userSession.idUser) {
          this.setState({showBtnComment: false})
        }
      })}


    }).catch(e => {
      console.log(e.response);
    });
  }


  removeEbook() {
    Axios.post('http://localhost:8080/api/ebook/delete', {token: UserStore.userSession.token, data :{idEbook : parseInt(this.state.id)}})
    .then(res=>this.setState({showRemoveModal:2}))
  }


  componentDidMount() {
    this.getBook();
  }

  render() {
    
    if(this.state.loading){
      return <div style={{
        margin: '20%'
    }}>
        <div className="col-2 mx-auto">
            <ReactLoading type="spinningBubbles" color="#4921bd" width={"100%"}/>
        </div>
    </div>
    }else{
     
      let updateBtn = '';
      if (UserStore.userSession.roleUser === 3) {
        updateBtn = <Button style={{width:"100%", marginBottom: "20px"}} onClick={() => this.setState({showModalUpdate: true})} variant="primary">Modifier</Button>
      }

      let removeBtn = '';
      if (UserStore.userSession.roleUser === 3) {
        removeBtn = <Button style={{width:"100%"}} className='mb-2' onClick={() => this.setState({showRemoveModal:1})} variant="danger">Supprimer</Button>
      }

      let commentBtn = '';
      if (this.state.showBtnComment) {
        commentBtn = <Button style={{width:"100%", marginLeft: "3%", marginBottom: "20px"}} onClick={() => this.setState({showModalComment: true})} variant="primary">Commenter</Button>
      }

      let modalRemove = ''
      if(this.state.showRemoveModal===1){
        modalRemove = <Modal show={true}>
          <Modal.Header closeButton onClick={() => this.setState({showRemoveModal : 0})}>
            <Modal.Title>Supprimer le fichier</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous bien sûr de vouloir supprimer ce livre ?
            <br/>
            <Button onClick={()=>this.removeEbook()}>OUI</Button>
          </Modal.Body>
        </Modal>
      }else if(this.state.showRemoveModal===2){
        modalRemove = <Modal show={true}>
          <Modal.Header>
            <Modal.Title>Supprimer le fichier</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant='success'>Le livre à bien été supprimé !</Alert>
            <br/>
            <Link to='/Home'>
              <Button onClick={()=>this.removeEbook()}>OK</Button>
            </Link>
          </Modal.Body>
        </Modal>
      }

      let modalUpdate = '';
      if (this.state.showModalUpdate) {
        modalUpdate = <ModalUpdateBook close={() => {this.setState({showModalUpdate: false, loading: true}); this.getBook();}} id={this.state.id}></ModalUpdateBook>
      }

      let modalComment = '';
      if (this.state.showModalComment) {
        modalUpdate = <ModalAddCommentUser id={this.id} close={() => {this.setState({showModalComment: false, loading: true}); this.getBook();}} id={this.state.id}></ModalAddCommentUser>
      }

      let modalRead = '';
      if (this.state.showModalRead) {
        modalRead = <BookReader close={() => {this.setState({showModalRead: false});}} id={this.state.id}></BookReader>
      }

      return (
        <Container style={{width: "70%", maxWidth: "none"}} className="mt-5">
          <Row style={{justifyContent: "spacing-around"}}>        
            <Col lg={2} >
              <div style={{position:"fixed", width: "10%"}}>
                <Button style={{width:"100%", marginBottom: "20px"}} onClick={() => this.setState({showModalRead: true})} variant="primary">Lire</Button> 
                {updateBtn}
                {removeBtn}

              </div>
            </Col>
            <Col lg={5} sm={10}>
                <BookInformation book={this.state.book}></BookInformation>
                

            </Col>
            <Col lg={5} sm={12}>
              <CardDeck>
                {this.state.book.press_comments.map((value, index) => <PressComment comments={value} key={index}></PressComment>)}
              </CardDeck>
              {commentBtn}
              <CardDeck>
                {this.state.book.user_comments.map((value, index) => <UserComment idBook={this.state.id} comment={value} key={index} getEbook={()=>{this.setState({loading: true});this.getBook()}}></UserComment>)}
                </CardDeck>
                
                </Col>
          </Row>
          {modalRemove}
          {modalUpdate}
          {modalComment}
          {modalRead}
        </Container>
      )
    }
}}



export default Book;

