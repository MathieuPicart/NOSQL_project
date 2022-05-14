import React, { Component } from 'react';
import ReactStars from 'react-stars';
import UserStore from '../Store/UserStore'
import Axios from 'axios';
import { Col, Button, Form, Row, Modal, Alert } from 'react-bootstrap';
import ModalAddPress from './ModalAddPress';



class ModalAddCommentPress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      comment: '',
      note:'',
      date: '',
      press: '',
      showModalPress: false,
      msg: '',
      errors: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleInputChange(event) {
    var key = event.target.name;
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  handleSubmit(event) {
    event.preventDefault();

    var errors = [];

    if (this.state.press === "") {
        errors.push("Press non choisie");
    }

    if (this.state.comment === "") {
        errors.push("Commentaire non saisie");
    }

    if (this.state.date === "") {
        errors.push("Date non sélectionné");
    }

    if (errors.length > 0) {
      this.setState({
        errors: errors
      });
      return false;

    } else {
      let press_to_send = {
        idPress: parseInt(this.state.id),
        name: this.state.name,
        text: this.state.comment,
        note: this.state.note,
        date: (new Date(this.state.date)).getTime()
      }
      this.props.fct(press_to_send);
      this.props.close()
    }
  }

  getPress = () => {
    Axios.post("http://localhost:8080/api/press/gets", {
      token: UserStore.userSession.token
    }).then((response) => {
      this.setState({press : response.data.data})    
    });
  }

  componentDidMount() {
    this.getPress();
  }



  render() {

    let alert = '';
      if(this.state.errors.length){
          alert = <Alert variant={'danger'}>{this.state.errors.map((error, index)=><div key={index}>{error}</div>)}</Alert>
      }

    let modalPress = '';
    if (this.state.showModalPress) {
      modalPress = <ModalAddPress getPress={() => {this.getPress()}} close={() => {this.setState({showModalPress: false});}}></ModalAddPress>
    }

    return (
  
      <Modal show={true}>
        <Modal.Header closeButton onClick={() => this.props.close()}>
          <Modal.Title>Ajouter un commentaire</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Col sm={11}>
            {alert}
            <Form.Group>
              <Form.Label>Presse</Form.Label>
              <Row>
                  <Col>
                    <Form.Control as="select" custom type="text" 
                      value={ this.state.name+ " "+this.state.id}
                      className={
                        this.hasError("press")
                        ? "form-control is-invalid"
                        : "form-control"
                      }
                      onChange={(e) => {
                        let tab = e.target.value.split(" ");
                        let id = tab.pop();
                        let name = tab.join(" ")
                          this.setState({
                            id: id,
                            name: name
                          })
                      }}
                    >
                    <option>-- Presse --</option>
                    {this.state.press.length?this.state.press.map(e => {
                      return(<option value={e.name+" "+e.id}>{e.name}</option>);
                    }):""}
                    </Form.Control>
                  </Col>
                  <Col>
                  <Button onClick={() => {this.setState({showModalPress: true});}} variant="primary">Ajouter une presse</Button>    

                  </Col>
                </Row>
              <Form.Label>Commentaire</Form.Label>
              <textarea className={
                              this.hasError("comment")
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="comment"
                          type="text"
                          placeholder="Commentaire..."
                          value={this.state.comment}
                          onChange={(e) => {
                              this.setState({
                                comment: e.target.value
                              })
                          }}/>
                <Form.Label>Date de publication</Form.Label>
              <input
                          type="date"
                          value={this.state.date}
                          className={
                              this.hasError("date")
                              ? "form-control is-invalid"
                              : "form-control"
                              }
                              onChange={(e) => {
                                  this.setState({
                                      date: e.target.value
                                  })
                                  this.handleInputChange(e)
                              }}
                          />
              <Form.Label>Note</Form.Label>
                <ReactStars
                count={5}
                onChange={e => {
                  this.setState({note: e});
                }}
                value={parseFloat(this.state.note)}
                size={24}
                color2={'#3200c4'} />
              
              
            </Form.Group>
          </Col>    
        </Modal.Body>

        <Modal.Footer>
        <Button style={{width: "100%"}} onClick={(e) => {this.handleSubmit(e);}}>Publier</Button>
          


        </Modal.Footer>
        {modalPress}
      </Modal>
    );
}}

export default ModalAddCommentPress;

