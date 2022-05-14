import React, { Component } from 'react'
import UserStore from '../Store/UserStore'
import Axios from 'axios';
import { Modal } from 'react-bootstrap';

export default class BookReader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            epub : '',
            dataFile : '',
            errors : []
        }
    }

    componentDidMount() {
        Axios.post("http://localhost:8080/api/epub/get", {
            token: UserStore.userSession.token,
            data : { idEbook : parseInt(this.props.id) }
        }, {responseType: 'blob'}).then((response) => {
            const file = new Blob(
                [response.data], 
                {type: 'application/pdf'});
              
            const fileURL = URL.createObjectURL(file);

            let seeMore = {...this.state.dataFile};

            seeMore.url = fileURL

            this.setState({dataFile: seeMore});
            
        }).catch(err => {
            this.setState({
                errors : err.response.data.errors
            })
        });
    }

    render() {
        return (
            <Modal className="reader" show={true} size='xl'>
                <Modal.Header closeButton onClick={()=>this.props.close()}>
                    <Modal.Title>{this.state.dataFile.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <object data={this.state.dataFile.url} type="application/pdf" width="100%" height="700">
                        <p>Vous n'avez pas de plugin PDF mais vous pouvez <a href={this.state.dataFile.url}>télécharger le fichier.</a></p>
                    </object>
                </Modal.Body>
            </Modal>
        )
    }
}
