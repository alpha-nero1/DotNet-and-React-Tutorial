import { makeAutoObservable, runInAction } from "mobx";
import { History } from "../..";
import { User, UserFormValues } from "../../types/user.model";
import agent from "../api/agent";
import { store } from "./store";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated(): boolean {
    return Boolean(this.user);
  }

  // Log the user into the app.
  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      // Because it is trying to set on a new tick.
      runInAction(() => {
        this.user = user;
      });
      History.push('/activites');
      // Wow easy way to use other deps, having access to parent store obj.
      store.modalStore.closeModal();
    } catch (e) {
      throw e;
    }
  }

  // Log the user out of the app.
  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem('jwt');
    this.user = null;
    History.push('/');
  }

  // Get the current user.
  getMe = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => this.user = user);
    } catch (e) { throw e; }
  }

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      // Because it is trying to set on a new tick.
      runInAction(() => {
        this.user = user;
      });
      History.push('/activites');
      // Wow easy way to use other deps, having access to parent store obj.
      store.modalStore.closeModal();
    } catch (e) {
      throw e;
    }
  }
}