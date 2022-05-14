import React, { Component } from 'react'
import ReactStars from 'react-stars';
import UserStore from '../Store/UserStore'
import { Col, Card, Row, Button } from 'react-bootstrap';
import ModalUpdateCommentUser from '../components/ModalUpdateCommentUser';


class UserComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comment,
      idEbook: this.props.idBook,
      showModalUpdate: false
    }
}

  render() {

    let comment = this.state.comment;
    let date = (new Date(comment.date)).toLocaleDateString('fr-FR',{ year: 'numeric', month: '2-digit', day: '2-digit'});

    let btnUpdate = '';
    if (this.state.comment.idUser === UserStore.userSession.idUser) {
      btnUpdate = <Button style={{width:"100%", marginLeft: "3%", marginTop: "20px"}} onClick={() => this.setState({showModalUpdate: true})} variant="primary">Modifier</Button>
    }

    let modalUpdate = '';
    if (this.state.showModalUpdate) {
      modalUpdate = <ModalUpdateCommentUser close={() => {this.setState({showModalUpdate: false}); this.props.getEbook();}} id={this.state.comment.id}></ModalUpdateCommentUser>
    }
   
    return (
      <Col sm={12} className="mb-2" >
        <Card border="light" style={{width:"100%"}}>
          <Card.Header>
            <Row style={{justifyContent: "space-between", marginLeft: '10px'}}>
              <Row>
                <img style={{borderRadius: "50%", width:"60px"}} alt="Utilisateur" src={comment.img}></img>
                <p style={{marginLeft:"10px", marginTop: '15px'}}>{comment.firstname} {comment.name}</p>
              </Row>
              <Row style={{marginTop: "12px", marginRight: "10px"}}>
                <ReactStars
                  count={5}
                  value={parseFloat(comment.note)}
                  edit={false}
                  size={20}
                  color2={'#3200c4'} />
                  <span style={{marginTop: "4px",marginLeft: "10px"}}>{date}</span>
              </Row>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              {comment.text}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
              {btnUpdate}
          </Card.Footer>
        </Card>
        {modalUpdate}
      </Col>
    );
}}

export default UserComment;

