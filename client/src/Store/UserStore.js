import { extendObservable } from "mobx";

class UserStore {
  clear() {
    this.loading = false;
    this.isLoggedIn = false;
    this.userSession = undefined; 
  }

  constructor() {
    extendObservable(this, {
      loading : true,
      isLoggedIn : false,
      userSession : undefined
    });
  }
}

export default new UserStore();
