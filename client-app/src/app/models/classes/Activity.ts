import { IActivity } from "../activity";

export default class Activity{
    Activity: IActivity;

    constructor(newActivity: IActivity)
    {
        this.Activity = newActivity;
    }

}