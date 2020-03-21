import { IUser } from '../../models/interfaces/IUser';
import { IActivity, IActivityAttendee } from '../../models/activity';

export const combineDateAndTime = (date: Date, time: Date) => {

  const dateString = date.toISOString().split('T')[0];
  const timeString = time.toISOString().split('T')[1];

  return new Date(dateString + 'T' + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date!);

  //these props below are for currently signed in user

  //check for all attendees, if the user is going to this
  activity.isGoing = activity.attendees.some(
    activ => activ.username === user.username
  );

  //check the attendees if it has the username and if that entry is host
  activity.isHost = activity.attendees.some(
    att => att.username === user.username && att.isHost
  );

  // return activity;
};

export const createAttendee = (user: IUser): IActivityAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!,
    following: false
  };
};
