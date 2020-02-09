import { IActivityCreateFormValues } from "../activity";

export class ActivityFormValues implements IActivityCreateFormValues
{
    id?: string = undefined;
    title: string = '';
    description: string = '';
    category: string ='';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';

    /**
     *
     */
    constructor(activity?: IActivityCreateFormValues) {
        if (activity && activity.date) {
            activity.time = activity.date;
        }

        //automatically map using assign
        Object.assign(this, activity);
    }
}