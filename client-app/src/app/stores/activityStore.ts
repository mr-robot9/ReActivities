import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import {ActivityService} from "../api/agent";
import { isNullOrUndefined } from "util";
import { history } from '../../';
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";


export default class ActivityStore
{
    rootStore: RootStore;
    registry = new Map();

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable IsLoading = false;
    @observable IsSubmitting = false;
    @observable target = '';


    @computed get activitiesByDate()
    {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    private groupActivitiesByDate(activities: IActivity[])
    {
        const sortedActivitiesByDate = activities.sort((a, b) => a.date.getTime() - b.date.getTime());

        let mapGroupedActivities = new Map<string, IActivity[]>();

        sortedActivitiesByDate.forEach((a) =>
        {
            let formattedDate = a.date!.toISOString().split('T')[0];

            if (mapGroupedActivities.has(formattedDate))
            {
                let currentActivities = mapGroupedActivities.get(formattedDate);
                currentActivities?.push(a);
                mapGroupedActivities.set(formattedDate, currentActivities!);
            }
            else
            {
                mapGroupedActivities.set(formattedDate, [a]);
            }

        });
        // console.log(mapGroupedActivities);

        return mapGroupedActivities;

    }

    @action selectActivity = (id: string | null) =>
    {
        this.selectedActivity = isNullOrUndefined(id) ? undefined : this.activityRegistry.get(id);
        console.log("activity is " + this.selectedActivity);
    }

    @action editActivity = async (activityToEdit: IActivity) =>
    {
        this.IsSubmitting = true;

        try
        {
            await ActivityService.update(activityToEdit);

            runInAction('Edit Activity', () =>
            {
                this.activityRegistry.set(activityToEdit.id, activityToEdit);
                this.selectedActivity = activityToEdit;
            });
            history.push(`/activities/${activityToEdit.id}`);

        }
        catch (error)
        {
            console.log(error);
            toast.error('Problem submitting data');
        }
        finally
        {
            runInAction('Edit Activity Final', () =>
            {
                this.IsSubmitting = false;
            })

        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) =>
    {
        this.IsSubmitting = true;
        this.target = event.currentTarget.name;

        try
        {
            await ActivityService.delete(id);

            runInAction('Deleting Activity', () =>
            {
                this.activityRegistry.delete(id);
            });
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction('Deleting Activity Error', () =>
            {

                this.IsSubmitting = false;
                this.target = '';
            });

        }
    }

    @action createActivity = async (newActivity: IActivity) =>
    {
        this.IsSubmitting = true;

        try
        {
            //add a new activity along with existing activities
            //create new activity on server, wait, THEN, do something with promise
            await ActivityService.create(newActivity);

            runInAction('Creating Activity', () =>
            {
                this.activityRegistry.set(newActivity.id, newActivity);
                this.selectedActivity = newActivity;
            });

            history.push(`/activities/${newActivity.id}`);

        }
        catch (error)
        {
            console.log(error);
            toast.error('Problem submitting data');
        }
        finally
        {
            runInAction('Create Activity Final', () =>
            {
                this.IsSubmitting = false;
            });
        }
    }

    @action loadActivities = async () =>
    {
        //mutating state in MobX, can't do this in Redux
        this.IsLoading = true;

        try
        {
            const activities = await ActivityService.list();

            runInAction('Loading Activities', () =>
            {
                //splitting in order show in form
                activities.forEach(a =>
                {
                    a.date = new Date(a.date!);
                    this.activityRegistry.set(a.id, a);
                });
            });


        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            runInAction('Loading Activity Final', () =>
            {
                this.IsLoading = false;
            });
        }
    }


    @action loadActivity = async (id: string) =>
    {
        const activity: IActivity = this.registry.get(id);

        if (activity)
        {
            return activity;
        }
        else
        {
            //no activity in registry, call from API
            this.IsLoading = true;
            try
            {
                let activity = await ActivityService.details(id);
                runInAction('getting activity', () =>
                {
                    activity.date = new Date(activity.date)
                    this.selectedActivity = activity;
                    this.setActivityInRegistry(activity);

                })
                return activity;

            }
            catch (error)
            {
                console.log(error);
            }
            finally
            {
                runInAction('load activity final', () =>
                {
                    this.IsLoading = false;
                })
            }
        }

    }
    private getActivity = (id: string) =>
    {
        let activ : IActivity = {    id: "08d7ae55-ab6e-4a40-874c-eb7aa8fa69df",
            title: "string",
            description: "string",
            category: "string",
            date: new Date,
            city: "string",
            venue: "string" }

         //return
         return activ;

    }

    private setActivityInRegistry = (activity: IActivity) =>
    {
        this.activityRegistry.set(activity.id, activity);
        this.registry.set(activity.id, activity);
    }
}
