import React, { Component } from "react";
import Axios from 'axios'
import UserStore from '../Store/UserStore'
import { Form, Alert, Modal, Button} from 'react-bootstrap'
import Cookie from 'js-cookie'



Axios.defaults.withCredentials = true;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
            errors: [],
            loginStatus: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    handleSubmit(event) {
        event.preventDefault();

        var errors = [];

        if (this.state.email === "") {
            errors.push("Email non saisie");
        }

        if (this.state.pass === "") {
            errors.push("Mot de passe non saisie");
        }

        this.setState({
            errors: errors
        });

        if (errors.length > 0) {
            return false;
        } else {
            this.login(); 
        }
    }
    
    login = () => {
        Axios.post("http://localhost:8080/api/login", {
            data : {
                email : this.state.email,
                pass : this.state.pass,
            }
            
        }).then((response) => {
            if (!response.data.success) {
                this.setState({
                    loginStatus: false,
                    errors : response.data.errors
                });
            } else {
                UserStore.userSession = response.data.data;
                UserStore.isLoggedIn = true;
                Cookie.set('token', response.data.data.token, {secure: 'false', expires:7})

                this.setState({
                    loginStatus: true
                });
            }
        }).catch(e => {
           this.setState({loginStatus: false, errors : e.response.data.errors});
        });
    };

    render() {
        let alert = '';
        if(this.state.errors.length){
            alert = <Alert variant={'danger'}>{this.state.errors.map((error, index)=><div key={index}>{error}</div>)}</Alert>
        }

        return (
            <Modal.Dialog style={{marginTop: '10%'}}>
                <Modal.Header>
                    <Modal.Title>Se connecter</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {alert}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control
                            className={this.hasError("login") ? "form-control is-invalid" : "form-control"}
                            name="login"
                            type="text"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                        /><br/>
                        <Form.Control
                            className={ this.hasError("pass") ? "form-control is-invalid" : "form-control" }
                            name="pass"
                            type="password"
                            placeholder="Mot de passe"
                            value={this.state.pass}
                            onChange={(e) => this.setState({ pass: e.target.value})}
                        /><br/>
                        
                        <Button style={{width: "100%"}} onClick={(e) => this.handleSubmit(e)}>Se connecter</Button>

                    </Form.Group>     
                </Modal.Body>
            </Modal.Dialog>
        )
      }
}

export default Login;
