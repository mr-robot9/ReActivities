import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore{
    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;        
    }

    //bc we're passing in a component and rendering the body, 
    //that component is making the body re-render mu6ltiple times 
    //which will be outside of an action
    //therefore, only make the modal property observable and not deeply into its 
    //properties
    @observable.shallow modal = {
        IsOpen: false,
        body: null
    }

    @action openModal = (content: any) => {
        this.modal.IsOpen = true;
        this.modal.body = content;
    }

    @action closeModal = () => {
        this.modal.IsOpen = false;
        this.modal.body = null;
    }
}