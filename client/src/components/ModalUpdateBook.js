import React, { Component } from "react";
import Axios from 'axios'
import TagsInput from 'react-tagsinput'
import UserStore from '../Store/UserStore'
import { Form, Alert, Modal, Button, Row} from 'react-bootstrap'
import '../react-tagsinput.css'

import ModalAddCommentPress from './ModalAddCommentPress';




Axios.defaults.withCredentials = true;

class ModalUpdateBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            title: '',
            author: '',
            dateParution: '',
            img: '',
            summary : '',
            msg: '',
            types : [],
            types_tags: [],
            key_words_tags: [],
            press_comments: [],
            showModalPressComment: false,
            errors: [],
            base64: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }

    /// TAG  ///
    handleKeyWordsChange(tags) {
        this.setState({key_words_tags: tags})
    }

    handleTypesChange(tags) {
        this.setState({types_tags: tags})
    }

    /// ERRORS  ///
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
    
        if (this.state.title === "") {
            errors.push("title");
        }

        if (this.state.summary === "") {
            errors.push("summary");
        }

        if (this.state.author === "") {
            errors.push("author");
        }

        if (this.state.dateParution === "") {
            errors.push("dateParution");
        }  

        this.setState({
          errors: errors
        });
    
        if (errors.length > 0) {
          return false;
        } else {
            this.updateBook();
        }
    }

    addPressComment = (press_comment) => {
    let temp = [...this.state.press_comments]
    temp.push(press_comment)
    this.setState({press_comments: temp});
    }

    removePress = (index) => {
    let temp = [...this.state.press_comments]
    temp.splice(index, 1)
    this.setState({press_comments: temp});
    }

    getBase64(file, cb) {
        if(typeof file!=='string'){
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                cb(reader.result)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }else{
            cb(file)
        }
    }

    getFormatDate(date){
        let dt = new Date(date)
        return dt.getFullYear() + "-" + ((dt.getMonth()+1)<10 ? "0"+(dt.getMonth()+1) : (dt.getMonth()+1)) + "-" + ((dt.getDate()+1)<10 ? "0"+(dt.getDate()) : (dt.getDate()));
    } 
    getBook = () => {
        Axios.post("http://localhost:8080/api/ebook/getData", {
            token: UserStore.userSession.token,
            data : { idEbook : parseInt(this.state.id) }
        }).then((response) => {
            let book = response.data.data
            let dateParution = this.getFormatDate(book.date)
            console.log(dateParution)
            this.setState({
                id : this.props.id,
                title: book.title,
                author: book.author,
                dateParution: dateParution,
                img: book.img,
                summary: book.summary,
                types_tags: book.types,
                key_words_tags: book.key_words,
                press_comments: book.press_comments,
                showModalPressComment: false,
                msg: ''
            })
        }).catch(e => {
            console.log(e.response);
        });
    }

    updateBook = () => {
        this.getBase64(this.state.img, (base64)=>{
            let data = { 
                idEbook : parseInt(this.state.id),
                title : this.state.title,
                author : this.state.author,
                date : (new Date(this.state.dateParution)).getTime(),
                img : base64,
                summary : this.state.summary,
                key_words : this.state.key_words_tags,
                idTypes : this.state.types_tags.map(e=>parseInt(e.id)),
                press_comments : this.state.press_comments.map((c) => {c.name = undefined;c.link = undefined;c.id = undefined; return c;})
            }
            Axios.post("http://localhost:8080/api/ebook/updt", {
                token: UserStore.userSession.token,
                data : data
            }).then((response) => {
                this.props.close()
            });
        })
        
    }
            

    componentDidMount() {
        this.getBook();
        this.getTypes();
    }
    

    addType = (type) => {
        let tab = type.split(" ");
        let id = tab.pop();
        let name = tab.join(" ")

        let temp = []
        if(this.state.types_tags.length) {
            temp = [...this.state.types_tags]
        }

        temp.push({id : id, name : name})

        this.setState({types_tags: temp});
    }

    removeType = (index) => {
        let temp = [...this.state.types_tags]
        temp.splice(index, 1)
        this.setState({types_tags: temp});
    }

    getTypes = () => {
        Axios.post("http://localhost:8080/api/type/gets", {
            token: UserStore.userSession.token
        }).then((response) => {
            this.setState({types : response.data.data})    
        });
    }

    render() {

        let press_comments = Object.values(this.state.press_comments);

        let modalPressComment = '';
        if (this.state.showModalPressComment) {
            modalPressComment = <ModalAddCommentPress fct={(new_press_comment)=> {this.addPressComment(new_press_comment)}} close={() => {this.setState({showModalPressComment: false});}}></ModalAddCommentPress>
        }

        let btnAddPress = '';
        if (press_comments.length < 4) {
            btnAddPress = <div style={{width:"100%", margin: "0 29%"}}><Button style={{marginLeft: "5px"}} onClick={() => this.setState({showModalPressComment: true})} variant="primary">Ajouter un commentaire</Button></div>
        } else {
            btnAddPress = '';
        }

        return (
            <div>
            <Modal show={true}>
                <Modal.Header closeButton onClick={() => this.props.close()}>
                    <Modal.Title>Modifier le livre</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Titre du livre</Form.Label>
                    <Form.Control

                    className={
                        this.hasError("title")
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="title"
                    type="text"
                    placeholder="Titre..."
                    value={this.state.title}
                    onChange={(e) => {
                        this.setState({
                            title: e.target.value
                        })

                        this.handleInputChange(e)
                    }}
                    />
                    <Form.Label>Auteur</Form.Label>
                    <Form.Control

                    className={
                        this.hasError("author")
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="author"
                    type="text"
                    placeholder="Auteur..."
                    value={this.state.author}
                    onChange={(e) => {
                        this.setState({
                            author: e.target.value
                        })

                        this.handleInputChange(e)
                    }}
                    />
                    <Form.Label>Date de parution</Form.Label>
                    <input
                    type="date"
                    value={this.state.dateParution}
                    className={
                        this.hasError("dateParution")
                        ? "form-control is-invalid"
                        : "form-control"
                        }
                        onChange={(e) => {
                            this.setState({
                                dateParution: e.target.value
                            })
                            this.handleInputChange(e)
                        }}
                    />
                    
              
                <Form.Label>Image</Form.Label>
                <input type="file" name="image" 
                onChange={(e) => {this.setState({img: e.target.files[0]})}}
                />

                <Form.Control
                    as="textarea"
                    placeholder="Résumé..."
                    onChange={(e)=>this.setState({summary: e.target.value})}
                    value={this.state.summary}
                />

                <Form.Label>Genre</Form.Label>
                <br/>
                {this.state.types_tags.map((value, index) => {
                    return (
                        <div className="ml-2 comment" key={index}>
                                <p>{value.name}<a onClick={(e)=>{this.removeType(index)}}>x</a></p> 
                        </div>
                    );
                })}
                <Form.Control 
                    as="select" 
                    custom 
                    type="text"
                    value="1"
                    onChange={(e)=>this.addType(e.target.value)} 
                >
                    <option value="1">-- Genre --</option>
                    {this.state.types.length ? this.state.types.map(e => <option value={e.name+' '+e.id}>{e.name}</option>) :""}
                </Form.Control>
                <br/>

                <Form.Label>Mots clés</Form.Label>
                <TagsInput value={this.state.key_words_tags} onChange={(e) => {this.handleKeyWordsChange(e)}} /><br/>

                <Form.Label>Commentaire de presse</Form.Label><br/>
                {press_comments.map((value, index) => {
                    return (
                        <div className="ml-2 comment">
                            {/* <Row className="ml-2" style={{justifyContent: "space-between", paddingTop: "10px"}}> */}
                                <p>{value.name} - {value.note}/5 <a onClick={(e)=>{this.removePress(index)}}>x</a></p> 
                                {/* <Button style={{marginRight: "25px", height: '30px', width: 'auto'}} onClick={(e)=>{this.removePress(index)}} variant="danger">X</Button>  */}
                            {/* </Row> */}
                        </div>
                    );
                })}
                {btnAddPress}                

                   
                    
                <br/><br/><Button style={{width: "100%"}} onClick={(e) => {this.handleSubmit(e);}}>Modifier</Button>
                    {this.state.msg?<Alert variant='danger' style={{textAlign: 'center', marginTop: '10px'}}>{this.state.msg}</Alert>:''}

                    </Form.Group>     
                </Modal.Body>
            </Modal>
            {modalPressComment}

            </div>
        )
      }
}

export default ModalUpdateBook;
