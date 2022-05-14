import React, { Component } from 'react';
import ReactStars from 'react-stars';
import UserStore from '../Store/UserStore'
import Axios from 'axios';
import { Col,  Button, Form, Modal } from 'react-bootstrap';





class ModalAddCommentUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      note:'',
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

  if (this.state.comment === "") {
      errors.push("comment");
  }

  this.setState({
    errors: errors
  });

  if (errors.length > 0) {
    return false;
  } else {
    this.addComment(); 
  }
}

addComment = () => {
  Axios.post("http://localhost:8080/api/comment/add", {
    token : UserStore.userSession.token,
    data : { idEbook: parseInt(this.props.id),
             text: this.state.comment,
             note: this.state.note
    }
  }).then((response) => {
    this.props.close()  
  });
};



  render() {
    return (
  
<Modal show={true}>
  <Modal.Header closeButton onClick={() => this.props.close()}>
    <Modal.Title>Ajouter un commentaire</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Col sm={12}>
      <Form.Group controlId="formBasicEmail">
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

                        this.handleInputChange(e)
                    }}/>
        <div style={{margin: "15px 15px"}}>
        
          <ReactStars
          count={5}
          onChange={e => {
            this.setState({note: e});
          }}
          value={parseFloat(this.state.note)}
          size={24}
          color2={'#3200c4'} />
        
        </div>
        
      </Form.Group>
    </Col>    
  </Modal.Body>

  <Modal.Footer>
    <Button style={{width: "100%"}} onClick={(e) => {this.handleSubmit(e);}}>Publier</Button>

  </Modal.Footer>
</Modal>
    );
}}

export default ModalAddCommentUser;

