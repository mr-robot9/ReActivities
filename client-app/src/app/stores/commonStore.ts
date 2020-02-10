import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

export default class CommonStore {
    rootStore: RootStore;


    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;


        //we react if any observable we specify is ever changed
        reaction(
            () => this.token,
            token => {
                if (token) {
                    //store in browsers local storage
                    window.localStorage.setItem('jwt', token);
                }
                else {
                    window.localStorage.removeItem('jwt');
                }
            }

        )
    }

    @observable token: string | null = window.localStorage.getItem('jwt');
    @observable appLoaded = false;

    @action setToken = (token: string | null) => {
        this.token = token;
    }

    @action setAppLoaded = () => {
        this.appLoaded = true;
    }
}