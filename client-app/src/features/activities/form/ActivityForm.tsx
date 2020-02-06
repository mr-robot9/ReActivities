import React, { useState, FormEvent, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid';
import { isNullOrUndefined } from 'util';
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite';
import { RouteComponentProps, Link } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';


interface IDetailParams {
    id: string;
}

/*
This component handles the edit view of a single selected Activity
OR a newly created Activity form 
*/

const ActivityForm: React.FC<RouteComponentProps<IDetailParams>> = ({ match, history }) => {

    const activityStore = useContext(ActivityStore)
    const { createActivity, editActivity, IsSubmitting, selectedActivity, loadActivity, selectActivity, IsLoading } = activityStore;


    //on load, set the form activity to be the one selected
    //on edit, change to the activity state which is only available in this component
    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    const handleSubmit = () => {

        if (isNullOrUndefined(activity.id)) {
            let newActivity = { ...activity, id: uuid() }
            createActivity(newActivity).then(() => {
                history.push(`/activities/${newActivity.id}`)
            });
        }
        else {
            editActivity(activity).then(() => {
                history.push(`/activities/${activity.id}`)
            });
        }

    }

    useEffect(() => {
        //only load an activity if there's an id in params 
        //2nd condition is for edit redirect back
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(() => {
                selectedActivity && setActivity(selectedActivity);
            });
        }

        //cleanup
        return () => {
            console.log("cleaning up");
            selectActivity(null);
        }
    }, [loadActivity, match.params.id, selectActivity, selectedActivity, activity.id.length])

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //set activity properties
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;

        setActivity({ ...activity, [name]: value })
        // console.log(event.target.placeholder);

    }

    //gets called before useEffect
    if (IsLoading) {
        console.log("loading");
        return <LoadingComponent content="Loading Activities" />
    }

    return (
        <Grid>
            <Grid.Column width="10">
                <Segment clearing>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input onChange={handleInputChange} name="title" placeholder="Title" value={activity?.title ?? ''} />
                        <Form.TextArea onChange={handleInputChange} name="description" rows={2} placeholder="Description" value={activity?.description ?? ''} />
                        <Form.Input onChange={handleInputChange} name="category" placeholder="Category" value={activity?.category ?? ''} />
                        <Form.Input onChange={handleInputChange} name="date" type='datetime-local' placeholder="Date" value={activity?.date ?? ''} />
                        <Form.Input onChange={handleInputChange} name="city" placeholder="City" value={activity?.city ?? ''} />
                        <Form.Input onChange={handleInputChange} name="venue" placeholder="Venue" value={activity?.venue ?? ''} />
                        <Button loading={IsSubmitting} floated='right' positive type='submit' content='Save' />
                        <Button as={Link} to="/activities" floated='right' content='Cancel' />

                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>

    )
}


export default observer(ActivityForm);


