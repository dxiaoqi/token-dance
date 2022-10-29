import { makeObservable, observable, action } from 'mobx';

class Ticket {
  @observable ticketsInfo = [];

  constructor() {
    makeObservable(this);
  }

  @action
  setUser(tickets: any) {
    this.ticketsInfo = tickets;
  }
}

export default Ticket;
