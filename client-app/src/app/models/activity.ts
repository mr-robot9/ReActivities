
export interface IActivity
{
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    attendees: IActivityAttendee[];
    isGoing: boolean;
    isHost: boolean;
    comments: IComment[];

}

export interface IComment
{
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
}

//optional properties
export interface IActivityCreateFormValues extends Partial<IActivity> {
    time?: Date
}

export interface IActivityAttendee{
    username: string; 
    displayName: string;
    image: string;
    isHost: boolean;
}