export interface IActivity
{
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;

}

//optional properties
export interface IActivityCreateFormValues extends Partial<IActivity> {
    time?: Date
}