import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import ActivityService from "../api/agent";
import { isNullOrUndefined } from "util";

configure({ enforceActions: 'always' })

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable IsLoading = false;
    @observable IsSubmitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    private groupActivitiesByDate(activities: IActivity[]) {

        const sortedActivitiesByDate = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

        let mapGroupedActivities = new Map<string, IActivity[]>();

        sortedActivitiesByDate.forEach((a) => {
            let formattedDate = a.date.split('T')[0];

            if (mapGroupedActivities.has(formattedDate)) {
                let currentActivities = mapGroupedActivities.get(formattedDate);
                currentActivities?.push(a);
                mapGroupedActivities.set(formattedDate, currentActivities!);
            }
            else {
                mapGroupedActivities.set(formattedDate, [a]);
            }

        });
        console.log(mapGroupedActivities);

        return mapGroupedActivities;

    }

    @action selectActivity = (id: string | null) => {
        this.selectedActivity = isNullOrUndefined(id) ? undefined : this.activityRegistry.get(id);
        console.log("activity is " + this.selectedActivity);
    }

    @action editActivity = async (activityToEdit: IActivity) => {
        this.IsSubmitting = true;

        try {
            await ActivityService.update(activityToEdit);

            runInAction('Edit Activity', () => {
                this.activityRegistry.set(activityToEdit.id, activityToEdit);
                this.selectedActivity = activityToEdit;
            });

        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction('Edit Activity Final', () => {
                this.IsSubmitting = false;
            })

        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.IsSubmitting = true;
        this.target = event.currentTarget.name;

        try {
            await ActivityService.delete(id);

            runInAction('Deleting Activity', () => {
                this.activityRegistry.delete(id);
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction('Deleting Activity Error', () => {

                this.IsSubmitting = false;
                this.target = '';
            });

        }
    }

    @action createActivity = async (newActivity: IActivity) => {
        this.IsSubmitting = true;

        try {
            //add a new activity along with existing activities
            //create new activity on server, wait, THEN, do something with promise
            await ActivityService.create(newActivity);

            runInAction('Creating Activity', () => {
                this.activityRegistry.set(newActivity.id, newActivity);
                this.selectedActivity = newActivity;
            });

        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction('Create Activity Final', () => {
                this.IsSubmitting = false;
            });
        }
    }

    @action loadActivities = async () => {
        //mutating state in MobX, can't do this in Redux
        this.IsLoading = true;

        try {
            const activities = await ActivityService.list();

            runInAction('Loading Activities', () => {
                //splitting in order show in form
                activities.forEach(a => {
                    a.date = a.date.split(".")[0];
                    this.activityRegistry.set(a.id, a);
                });
            });


        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction('Loading Activity Final', () => {
                this.IsLoading = false;
            });
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity;
        }
        else {
            //no activity in registry, call from API
            this.IsLoading = true;
            try {
                activity = await ActivityService.details(id);
                runInAction('getting activity', () => {
                    this.selectedActivity = activity;
                })
            }
            catch (error) {
                console.log(error)
            }
            finally {
                runInAction('load activity final', () => {
                    this.IsLoading = false;
                })
            }
        }

        console.log("final" + this.selectedActivity?.id);


    }
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }
}

export default createContext(new ActivityStore());