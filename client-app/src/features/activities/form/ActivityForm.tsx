import React, { useState, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import {v4 as uuid} from 'uuid';
import { isNullOrUndefined } from 'util';

interface IProps {
    handleEditCreateToggle: () => void;
    selectedActivity: IActivity;
    handleSelectActivity: (id: string | null) => void;
    handleCreateActivity: (activity: IActivity) => void;
    handleEditActivity: (activity: IActivity) => void;

}

/*
This component handles the edit view of a single selected Activity
OR a newly created Activity form 
*/


export const ActivityForm: React.FC<IProps> = ({ 
    handleEditCreateToggle, 
    selectedActivity,
    handleCreateActivity,
    handleEditActivity
}) => {

    //on load, set the form activity to be the one selected
    //on edit, change to the activity state which is only available in this component
    const [activity, setActivity] = useState<IActivity>(selectedActivity);

    const handleSubmit = () => {

        if (isNullOrUndefined(activity.id))
        {
            let newActivity = {...activity, id: uuid()}
            handleCreateActivity(newActivity);
        }
        else
        {
            handleEditActivity(activity);
        }

        

        console.log(activity);
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //set activity properties
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;

        setActivity({ ...activity, [name]: value })
        // console.log(event.target.placeholder);

    }

    return (
        <Segment clearing>
            <Form onSubmit = {handleSubmit}>
                <Form.Input onChange={handleInputChange} name="title" placeholder="Title" value={activity?.title ?? ''} />
                <Form.TextArea onChange={handleInputChange} name="description" rows={2} placeholder="Description" value={activity?.description ?? ''} />
                <Form.Input onChange={handleInputChange} name="category" placeholder="Category" value={activity?.category ?? ''} />
                <Form.Input onChange={handleInputChange} name="date" type='datetime-local' placeholder="Date" value={activity?.date ?? ''} />
                <Form.Input onChange={handleInputChange} name="city" placeholder="City" value={activity?.city ?? ''} />
                <Form.Input onChange={handleInputChange} name="venue" placeholder="Venue" value={activity?.venue ?? ''} />
                <Button floated='right' positive type='submit' content='Save'/>
                <Button onClick={handleEditCreateToggle} floated='right' content='Cancel' />

            </Form>
        </Segment>
    )
}
