import React, { Component } from 'react';
import UserStore from '../Store/UserStore'
import Axios from 'axios';
import { Col, Button, Form, Modal } from 'react-bootstrap';


class ModalAddPress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      link: '',
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

  if (this.state.name === "") {
      errors.push("name");
  }

  if (this.state.link === "") {
      errors.push("link");
  }

  this.setState({
    errors: errors
  });

  if (errors.length > 0) {
    return false;
  } else {
    this.addPress();
  }
}

addPress = () => {
  Axios.post("http://localhost:8080/api/press/add", {
       token : UserStore.userSession.token,
       data : {  name : this.state.name,
                 link : this.state.link,
       }
  }).then((response) => {
    console.log(response);
    this.props.getPress();
    this.props.close()

  });
};



  render() {
    return (
  
<Modal show={true}>
  <Modal.Header closeButton onClick={() => this.props.close()}>
    <Modal.Title>Ajouter une presse</Modal.Title>
  </Modal.Header>
  <br/><br/><br/><br/>

  <Modal.Body>
    <Col sm={11}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Nom presse</Form.Label>
        <Form.Control className={
                        this.hasError("name")
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="name"
                    type="text"
                    placeholder="Titre..."
                    value={this.state.name}
                    onChange={(e) => {
                        this.setState({
                          name: e.target.value
                        })

                        this.handleInputChange(e)
                    }}/>
        <Form.Label>Liens presse</Form.Label>
        <Form.Control className={
                        this.hasError("link")
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="link"
                    type="url"
                    placeholder="Url..."
                    value={this.state.link}
                    onChange={(e) => {
                        this.setState({
                          link: e.target.value
                        })

                        this.handleInputChange(e)
                    }}/>
          
        
      </Form.Group>
    </Col>    
  </Modal.Body>
  <br/><br/><br/>
  <Modal.Footer>
    <Button style={{width: "100%"}} onClick={(e) => {this.handleSubmit(e)}}>Publier</Button>

  </Modal.Footer>
</Modal>
    );
}}

export default ModalAddPress;

