import { observable, computed, runInAction, action } from 'mobx';
import { IUser, IUserFormValues } from '../models/interfaces/IUser';
import { UserService } from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await UserService.register(values);

      runInAction(() => {
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.modalStore.closeModal();
      });
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await UserService.login(values);

      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.modalStore.closeModal();
      });
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;

    history.push('/');
  };

  @action getSetUser = async () => {
    try {
      const user = await UserService.current(); //the API will use the token to figure out user

      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };
}
