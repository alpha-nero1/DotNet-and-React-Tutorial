import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../../types/server-error";

export default class CommonStore {
  error: ServerError | null = null;
  // Attempt to get the token from local storage on site boot.
  token: string | null = window.localStorage.getItem("jwt");
  appIsLoaded = false;

  constructor() {
    makeAutoObservable(this);

    // We can use reactions!
    reaction(
      () => this.token,
      token => {
        if (token) window.localStorage.setItem("jwt", token);
        else window.localStorage.removeItem("jwt");
      }
    )
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  }

  setToken = (token: string | null) => {
    this.token = token;
  }

  setAppIsLoaded = () => {
    this.appIsLoaded = true;
  }
}