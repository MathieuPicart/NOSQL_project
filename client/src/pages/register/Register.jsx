import "./register.css";
import {useState} from "react";
import Axios from "axios";
import {Link} from "react-router-dom"



export default function Register() {
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [passwordConfReg, setPasswordConfReg] = useState('');

  const [lastnameReg, setLastnameReg] = useState('');
  const [firstnameReg, setFirstnameReg] = useState('');
  const [phoneReg, setPhoneReg] = useState('');
  const [adressReg, setAdressReg] = useState('');
  const [biofReg, setBioReg] = useState('');

  const [msg, setMsg] = useState('');

  Axios.defaults.withCredentials = true;

  const register = () => {
    if(passwordReg === passwordConfReg) {
        Axios.post('http://localhost:5000/api/auth/signup', {
            data: {
                email: emailReg,
                mdp: passwordConfReg,
                nom: lastnameReg,
                prenom: firstnameReg,
                telephone: phoneReg,
                adresse: adressReg,
                bio: biofReg
            }
            }).then(res => {
                console.log("ca passe")

                setMsg("Votre compte a été crée !")
                console.log(res.data);
            }).catch(err => {
                setMsg(err.response.data);
            })
      } else {
          alert("Les mots de passe ne correspondent pas");
      }
  }

return (
<div className="register">
    <div className="registerWrapper">
        <div className="registerLeft">
            <h3 className="registerLogo">🍑 Fessebook</h3>
            <span className="registerDesc">
                Partagez vos fesses a tout le monde ! 😏
            </span>
        </div>
        <div className="registerRight">
            <form className="registerBox">
                <input placeholder="E-mail" type="email" required className="registerInput" onChange={(e) => {setEmailReg(e.target.value)}}/>
                <input placeholder="Mot de passe" type="password" required minLength="6" className="registerInput" onChange={(e) => {setPasswordReg(e.target.value)}}/>
                <input placeholder="Comfirmation mot de passe" type="password" required minLength="6" className="registerInput" onChange={(e) => {setPasswordConfReg(e.target.value)}}/>
                <hr/>
                <input placeholder="Nom" type="text" required className="registerInput" onChange={(e) => {setLastnameReg(e.target.value)}}/>
                <input placeholder="Prénom" type="text" required className="registerInput" onChange={(e) => {setFirstnameReg(e.target.value)}}/>
                <input placeholder="Téléphone" type="tel"  pattern="^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$" required className="registerInput" onChange={(e) => {setPhoneReg(e.target.value)}}/>
                <input placeholder="Adresse" type="text" required className="registerInput" onChange={(e) => {setAdressReg(e.target.value)}}/>
                <textarea placeholder="Bio" type="text" required className="registerInput" onChange={(e) => {setBioReg(e.target.value)}}/>
                {msg}
                <button className="registerButton" type="submit" onClick={() => register()}>Créer mon compte</button>
                <Link className="registerRegisterButton" to="/login">Se connecter</Link>
            </form>
        </div>
    </div>
</div>
);
}