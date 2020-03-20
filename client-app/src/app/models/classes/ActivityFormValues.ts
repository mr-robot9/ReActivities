import { IActivityCreateFormValues } from '../activity';

export class ActivityFormValues implements IActivityCreateFormValues {
  id?: string = undefined;
  title = '';
  description = '';
  category = '';
  date?: Date = undefined;
  time?: Date = undefined;
  city = '';
  venue = '';

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
