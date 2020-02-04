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
    @observable IsEditCreateMode = false;
    @observable IsSubmitting = false;
    @observable target = '';

    @computed get activitiesByDate(): IActivity[] {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    @action selectActivity = (id: string | null) => {
        this.selectedActivity = isNullOrUndefined(id) ? undefined : this.activityRegistry.get(id);
        this.IsEditCreateMode = false;
    }

    @action openEditForm = (id: string) => {
        this.IsEditCreateMode = true;
        this.selectedActivity = this.activityRegistry.get(id);
    }

    @action cancelFormOpen = () => {
        this.IsEditCreateMode = false;
    }

    @action editActivity = async (activityToEdit: IActivity) => {
        this.IsSubmitting = true;

        try {
            await ActivityService.update(activityToEdit);

            runInAction('Edit Activity', () => {
                this.activityRegistry.set(activityToEdit.id, activityToEdit);
                this.selectedActivity = activityToEdit;
                this.IsEditCreateMode = false;
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
                this.IsEditCreateMode = false;
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

    @action openCreateForm = () => {
        this.IsEditCreateMode = true;
        this.selectedActivity = undefined;
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

    @action loadActivity = async (id: String) => {
        
    }
}

export default createContext(new ActivityStore());