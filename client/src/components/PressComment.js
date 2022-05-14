import React, { Component } from 'react'
import ReactStars from 'react-stars';
import { Col, Card, Row } from 'react-bootstrap';




class PressComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.comments
    }
}

  render() {

    let comment = this.state.comment;
    let date = (new Date(comment.date)).toLocaleDateString('fr-FR',{ year: 'numeric', month: '2-digit', day: '2-digit'});

   
    return (
      <Col sm={12} lg={6} className="mb-2" >
        <Card border="light" style={{width:"100%", height:"180px"}}>
          <Card.Body>
            <Card.Title>{comment.name}</Card.Title>
            <Card.Text>
              {comment.text}            
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Row style={{justifyContent: "space-between"}}>
            <ReactStars
              count={5}
              value={parseFloat(comment.note)}
              edit={false}
              size={20}
              color2={'#3200c4'} />
              <span style={{marginTop: "4px"}}>{date}</span>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    );
}}

export default PressComment;

