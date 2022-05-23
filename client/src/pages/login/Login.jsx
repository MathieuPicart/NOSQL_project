import "./login.css";
import {useState, useEffect} from "react";
import Axios from "axios";
import {Link, useHistory} from "react-router-dom"


export default function Login() {

  const [emailLog, setEmailLog] = useState('');
  const [passwordLog, setPasswordLog] = useState('');

  const [message, setMessage] = useState('');

  let history = useHistory();
  Axios.defaults.withCredentials = true;

  const login = () => {
    Axios.post('http://localhost:5000/api/auth/signin', {
      data: {
          email: emailLog,
          mdp: passwordLog,
      }
      }).then(res => {
          console.log(res)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('email', res.data.user.email)
          localStorage.setItem('prenom', res.data.user.prenom)
          localStorage.setItem('nom', res.data.user.nom)
          localStorage.setItem('bio', res.data.user.bio)
          localStorage.setItem('adresse', res.data.user.adresse)
          // localStorage.setItem('telephone', res.data.user.telephone)
          history.push("/");
      }).catch(err => {
          console.log(err.response.data);
          setMessage(err.response.data);
      })
}

// useEffect(() => {
//   Axios.get('http://localhost:5000/auth/signin').then((res) => {
//     console.log(res);
//   })
// }, [])

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
        <h3 className="loginLogo">🍑 Fessebook</h3>
            <span className="loginDesc">
                Partagez vos fesses a tout le monde ! 😏
            </span>
        </div>
        <div className="loginRight">
          <form className="loginBox">
            <input
              placeholder="E-mail"
              type="email"
              required
              className="loginInput"
              onChange={(e) => {setEmailLog(e.target.value)}}
            />
            <input
              placeholder="Mot de passe"
              type="password"
              required
              minLength="6"
              className="loginInput"
              onChange={(e) => {setPasswordLog(e.target.value)}}
            />
            {message}
            <button className="loginButton" type="submit" onClick={login}>Se connecter</button>
            <span className="loginForgot">Mot de passe oublié ?</span>
            <Link to="/register" className="loginRegisterButton">Créer mon compte</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
