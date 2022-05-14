import React from "react";
import "./App.css";
import { observer } from 'mobx-react';
import Navigation from "./Navigation/Navigation";
import UserStore from "./Store/UserStore";
import Cookie from "js-cookie"
import axios from "axios"


class App extends React.Component {

  componentDidMount(){

    let token = Cookie.get('token');
    if(UserStore.userSession){
      token = UserStore.userSession.token
    }

    try {
      if(token){
        axios.post('http://localhost:8080/api/login/isLoggedIn', {token : token})
        .then(res=>{

          let result = res.data


          if(result && result.success){          
            UserStore.userSession = {token: token, idUser: result.data.idUser, roleUser: result.data.roleUser};
            UserStore.loading = false;
            UserStore.isLoggedIn = true;
          }
          else{
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
          }
        }).catch(err=>{
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
          }
        )
      }else{
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }

    }

    catch(e){
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }

  }

  render(){

    if(UserStore.loading){
      return (<div>Chargement</div>)
    }else{
      return (
        <div className="app">
          <Navigation/>
        </div>
      );
    }
  }
}

export default observer(App);
 