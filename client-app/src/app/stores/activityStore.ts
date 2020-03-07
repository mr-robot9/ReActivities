import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import { ActivityService } from "../api/agent";
import { isNullOrUndefined } from "util";
import { history } from '../../';
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/util/util";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";


export default class ActivityStore
{
    rootStore: RootStore;
    registry = new Map();

    constructor(rootStore: RootStore)
    {
        this.rootStore = rootStore;
    }

    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable IsSubmitting = false;
    @observable target = '';
    @observable IsLoading = false; //for loading components
    @observable IsActionLoading = false; //for loading calls to API once already in component
    @observable.ref hubConnection: HubConnection | null = null; //null bc only load when Activity Details page is loaded

    //create hub connection to listen to events
    @action createHubConnection = (activityId: string) =>
    {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/chat", {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information)
            .build();
        this.hubConnection.start()
        .then(() => console.log(this.hubConnection!.state))
        .then(() => {
            console.log('Attempting to join group')
            this.hubConnection!.invoke('AddToGroup', activityId);
        })
        .catch((error) => console.log('Error establishing connection: ', error));

        //when ReceiveComment from ChatHub is invoked
        this.hubConnection.on('ReceiveComment', comment =>
        {
            runInAction(() =>
            {
                this.selectedActivity!.comments.push(comment);

            });
        });

    };

    //turn off connection when leaving activity detail page
    @action stopHubConnection = () =>
    {
        this.hubConnection!.invoke('RemoveFromGroup', this.selectedActivity!.id).then(() => {
            this.hubConnection!.stop();
        })
        .then(() => console.log("Connection has stopped"))
        .catch((err) => console.log("Error: ", err));
    }

    @action addComment = async (values: any) =>
    {
        //prop has to match server side prop
        values.ActivityId = this.selectedActivity!.id;

        try
        {
            //invoke server side chat hub method
            await this.hubConnection!.invoke("SendComment", values);
        } catch (error)
        {
            console.log(error);
        }
    }


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

            //when we create an activity, manually set the props,
            //bc when we load the activity, it will be from registry rather than api
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            newActivity.attendees = attendees;
            newActivity.isHost = true;
            newActivity.comments = [];

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

        //get current logged in user;
        const user = this.rootStore.userStore.user!;

        try
        {
            const activities = await ActivityService.list();

            runInAction('Loading Activities', () =>
            {
                //splitting in order show in form
                activities.forEach(a =>
                {
                    setActivityProps(a, user);
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
        const user = this.rootStore.userStore.user!;

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
                    setActivityProps(activity, user);

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

    @action attendActivity = async () =>
    {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.IsActionLoading = true;
        try
        {
            await ActivityService.attend(this.selectedActivity!.id);

            runInAction(() =>
            {
                if (this.selectedActivity)
                {
                    this.selectedActivity.attendees.push(attendee);
                    this.selectedActivity.isGoing = true;
                    this.setActivityInRegistry(this.selectedActivity);
                    this.IsActionLoading = false;
                }
            });


        }
        catch (error)
        {
            runInAction(() =>
            {
                this.IsActionLoading = false;
            })
            toast.error('Problem signing up to activity')
        }

    }

    @action cancelAttendance = async () =>
    {
        this.IsActionLoading = true;
        try
        {
            await ActivityService.unattend(this.selectedActivity!.id);

            runInAction(() =>
            {
                if (this.selectedActivity)
                {
                    this.selectedActivity.attendees = this.selectedActivity.attendees.filter(a => a.username !== this.rootStore.userStore.user!.username);
                    this.selectedActivity.isGoing = false;
                    this.setActivityInRegistry(this.selectedActivity);
                    this.IsActionLoading = false;
                }
            })
        } catch (error)
        {
            toast.error('Problem cancelling attendance');
            this.IsActionLoading = false;
        }

    }

    private setActivityInRegistry = (activity: IActivity) =>
    {
        this.activityRegistry.set(activity.id, activity);
        this.registry.set(activity.id, activity);
    }
}
