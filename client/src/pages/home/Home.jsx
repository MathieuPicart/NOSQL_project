import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import "./home.css"
import {useState, useEffect} from "react";
import Axios from "axios";
import {Link, useHistory} from "react-router-dom"



Axios.defaults.withCredentials = true;

export default function Home() {

const [loginStatus, setLoginStatus] = useState('');


useEffect(() => {
    Axios.post('http://localhost:5000/api/auth/issignin', {
        data: {
            email: localStorage.getItem('email'),
            token: localStorage.getItem('token'),
        }
    }).then(res => {
        setLoginStatus(true);
    }).catch(err => {
        console.log(err.response.data);
    })
}, [])

if(loginStatus) {
    return (
    <div>
        <Topbar />
        <div className="homeContainer">
            <Sidebar />
            <Feed />
            <Rightbar />
        </div>
    </div>
    )
} else {
    return (
        <div>
            <Topbar />
            <div className="homeContainer">
                <div>Vous n'êtes pas connecté !</div>
                <Link to="/login">Se connecter</Link>
            </div>
        </div>
        )
}

}