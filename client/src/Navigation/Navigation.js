import React  from 'react';
import {Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom';
import UserStore from '../Store/UserStore';
import { observer } from 'mobx-react';
import Axios from 'axios'
import Cookie from 'js-cookie'
import { Navbar, Nav, Image } from 'react-bootstrap'


import Login from '../pages/Login';
import HomeUser from '../pages/Home/HomeUser'
import Book from '../pages/Book';
import Favoris from '../pages/Favoris';

import ModalAddCommentUser from '../components/ModalAddCommentUser';
import ModalAddCommentPress from '../components/ModalAddCommentPress';
import ModalAddBook from '../components/ModalAddBook';



class Navigation extends React.Component {
    async doLogout() {
        try {
            if(UserStore.userSession) {
                Axios.post("http://localhost:8080/api/login/logout", {
                    token: UserStore.userSession.token
                }).then((response)=> {
                    if (!response) {
                        console.log("failed to logout");
                    } else {
                      console.log("Successfully deconnnected");
                      Cookie.remove('token')
                      UserStore.clear();
                    }
                })
            }
        } catch(e) {
            console.error(e)
        }
    }

  render() { 
      if(UserStore.isLoggedIn) {
          if(UserStore.userSession.roleUser === 1) { // Student
              return (
                  <Router>
                      <Navbar className="sticky-top"variant="dark">
                        <Navbar.Brand >
                                <Link to='/'>
                                <Image style={{width: "40px", height:"40px", marginRight: "20px"}} src="logo.png"></Image>
                                    UBOOKS    
                                </Link>  
                            </Navbar.Brand>
                          <Nav className="mr-auto">
                              <Link to="/favoris">Favoris</Link>
                          </Nav>
                          <Link onClick={() => this.doLogout()} to="/" >Déconnexion</Link>
                      </Navbar>

                      <Switch>
                          <Route path="/" exact component={HomeUser}></Route>
                          <Route path="/Home" exact component={HomeUser}></Route>
                          <Route path="/addComment" exact component={ModalAddCommentUser}></Route>
                          <Route path="/Book/:id" exact component={Book}></Route>
                          <Route path="/favoris" exact component={Favoris}></Route>
                          <Route path="/" component={()=>(<div>ERR 404</div>)}/>
                      </Switch>
                  </Router>
              )
          }

          if(UserStore.userSession.roleUser === 3) { // ADMIN
              return (
                  <Router>
                      <Navbar className="sticky-top" variant="dark">
                            <Navbar.Brand >
                                <Link to='/'>
                                <Image style={{width: "40px", height:"40px", marginRight: "20px"}} src="logo.png"></Image>
                                    UBOOKS    
                                </Link>  
                            </Navbar.Brand>
                          <Nav className="mr-auto">
                              <Link to="/favoris">Favoris</Link>
                              <Link to="/addBook">Ajouter un livre</Link>
                          </Nav>
                          <Link onClick={() => this.doLogout()} to="/" >Déconnexion</Link>
                      </Navbar>

                      <Switch>
                        <Route path="/" exact component={HomeUser}></Route>
                        <Route path="/Home" exact component={HomeUser}></Route>
                        <Route path="/addComment" exact component={ModalAddCommentUser}></Route>
                        <Route path="/addCommentPress" exact component={ModalAddCommentPress}></Route>
                        <Route path="/addBook" exact component={ModalAddBook}></Route>
                        <Route path="/favoris" exact component={Favoris}></Route>
                        <Route path="/Book/:id" exact component={Book}></Route>
                        <Route path="/" component={()=>(<div>ERR 404</div>)}/>
                      </Switch>
                  </Router>
              )
          }
          
      } else {
          return (
              <Router>
                  <Navbar className="sticky-top" variant="dark">
                        <Navbar.Brand >
                        <Image style={{width: "40px", height:"40px", marginRight: "20px"}} src="logo.png"></Image>
                            UBOOKS      
                        </Navbar.Brand>
                      <Nav className="mr-auto">
                      </Nav>
                  </Navbar>

                  <Switch>
                      <Route path="/" exact component={Login}></Route>
                      <Route path="/" component={()=>(<div>ERR 404</div>)}/>
                  </Switch>
              </Router>
          )
      }
  } 
}

export default observer(Navigation);
