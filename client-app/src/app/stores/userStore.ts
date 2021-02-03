import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { history } from "../..";
import agentObjects from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class userStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      user: observable,
      isLoggedIn: computed,
      login: action,
      register: action,
      logout: action,
      getUser: action,
    });
  }

  user: IUser | null = null;

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (values: IUserFormValues) => {
    try {
      const user = await agentObjects.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  register = async (values: IUserFormValues) => {
    try {
      const user = await agentObjects.User.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  getUser = async () => {
    try {
      const user = await agentObjects.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };
}
