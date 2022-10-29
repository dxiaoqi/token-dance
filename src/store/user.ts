import { makeObservable, observable, action } from 'mobx';

class User {
  @observable userInfo = {};

  constructor() {
    makeObservable(this);
  }

  @action
  setUser(info: any) {
    this.userInfo = {
      ...info
    }
  }
}

export default User;
