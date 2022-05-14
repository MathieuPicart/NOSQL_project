import React, { Component } from "react";
import Axios from 'axios'
import TagsInput from 'react-tagsinput'
import UserStore from '../Store/UserStore'
import { Form, Alert, Modal, Button, Row} from 'react-bootstrap'
import '../react-tagsinput.css'

import ModalAddCommentPress from './ModalAddCommentPress';




Axios.defaults.withCredentials = true;

class ModalAddBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            dateParution: '',
            file: '',
            img: '',
            msg: '',
            summary : '',
            types: [],
            types_tags: [],
            key_words_tags: [],
            press_comments: [],
            showModalPressComment: false,
            errors: [],
            base64: "",
            variantAlert : 'danger'
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
            errors.push("Titre non saisie");
        }else if(this.state.title.length > 45){
            errors.push("Titre trop long ( 45 caractère max. )")
        }

        if (this.state.author === "") {
            errors.push("Auteur non saisie");
        }else if(this.state.author.length > 100){
            errors.push("Auteur trop long ( 100 caractère max. )")
        }

        if (this.state.summary === "") {
            errors.push("Résumé non saisie");
        }else if(this.state.summary.length > 250){
            errors.push("Résumé trop long ( 250 caractère max. )")
        }

        if (this.state.dateParution === "") {
            errors.push("Date de parution non saisie");
        }
        
        if (this.state.file === "") {
            errors.push("Pdf non saisie");
        }

        if (this.state.img === "") {
            errors.push("Première de couverture non saisie");
        }

        this.setState({
            errors: errors,
            variantAlert : 'danger'
        });

        if (errors.length > 0) {
            return false;
        } else {
            this.addBook();
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

    removeType = (index) => {
        let temp = [...this.state.types_tags]
        temp.splice(index, 1)
        this.setState({types_tags: temp});
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

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }


   

    addBook = () => {
        this.getBase64(this.state.img, (base64)=>{
            let data = new FormData() 
            data.append('token', UserStore.userSession.token)
            data.append('data', JSON.stringify({ 
                    title : this.state.title,
                    author : this.state.author,
                    date : (new Date(this.state.dateParution)).getTime(),
                    img : base64,
                    summary : this.state.summary,
                    key_words : this.state.key_words_tags,
                    idTypes : this.state.types_tags.map(e=>parseInt(e.id)),
                    press_comments : this.state.press_comments.map((c) => {c.name = undefined; return c;})
                })
            )
            data.append('file', this.state.file)


            Axios.post("http://localhost:8080/api/ebook/add", data
            ).then((response) => {
                if(response.data.success){
                    this.setState({errors : ['Le livre a bien été ajouté'], variantAlert: 'success'})
                }else{
                    this.setState({errors : response.data.errors, variantAlert : 'danger'})
                }
                
            }).catch(e=>{
                this.setState({errors : e.response.data.errors, variantAlert : 'danger'})
            });
        })
    };
    
    getTypes = () => {
        Axios.post("http://localhost:8080/api/type/gets", {
            token: UserStore.userSession.token
        }).then((response) => {
            this.setState({types : response.data.data})    
        });
    }

    componentDidMount() {
        this.getTypes();
    }

    render() {

        let alert = '';
        if(this.state.errors.length){
            alert = <Alert variant={this.state.variantAlert}>{this.state.errors.map((error, index)=><div key={index}>{error}</div>)}</Alert>
        }

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
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Ajouter un livre</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {alert}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Titre du livre</Form.Label>
                            <Form.Control
                                className={this.hasError("title") ? "form-control is-invalid" : "form-control"}
                                name="title"
                                type="text"
                                placeholder="Titre..."
                                value={this.state.title}
                                onChange={(e) => this.setState({title: e.target.value})}
                            />
                            <Form.Label>Auteur</Form.Label>
                            <Form.Control

                                className={this.hasError("author") ? "form-control is-invalid" : "form-control"}
                                name="author"
                                type="text"
                                placeholder="Auteur..."
                                value={this.state.author}
                                onChange={(e) => this.setState({ author: e.target.value })}
                            />
                            <Form.Label>Date de parution</Form.Label>
                            <input
                                type="date"
                                value={this.state.dateParution}
                                className={this.hasError("dateParution") ? "form-control is-invalid" : "form-control"}
                                onChange={(e) => this.setState({dateParution: e.target.value})}
                            />
                            
                            <Form.Label>Fichier .pdf</Form.Label>
                            <input 
                                type="file" 
                                name="file" 
                                enctype='multipart/form-data'
                                onChange={(e) => this.setState({file: e.target.files[0]})}
                            />

                            <Form.Label>Première de couverture</Form.Label>
                            <input 
                                type="file" 
                                name="image" 
                                onChange={(e) => this.setState({img: e.target.files[0]})}
                            />

                            <Form.Control
                                as="textarea"
                                name="summary"
                                placeholder="Résumé..."
                                onChange={(e)=>this.setState({summary : e.target.value})}
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
                            <TagsInput 
                                value={this.state.key_words_tags} 
                                onChange={(e) => this.handleKeyWordsChange(e)} 
                            />
                            <br/>

                            <Form.Label>Commentaire de presse</Form.Label><br/>
                            {press_comments.map((value, index) => {
                                return (
                                    <div className="ml-2 comment">
                                            <p>{value.name} - {value.note}/5 <a onClick={(e)=>{this.removePress(index)}}>x</a></p>
                                    </div>
                                );
                            })}
                            {btnAddPress}                

                            <br/>
                            <br/>
                            <Button 
                                style={{width: "100%"}} 
                                onClick={(e) => this.handleSubmit(e)}
                            >Ajouter</Button>

                        </Form.Group>     
                    </Modal.Body>
                </Modal.Dialog>
                {modalPressComment}

            </div>
        )
      }
}

export default ModalAddBook;
