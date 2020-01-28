import React from 'react'
import { Grid, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { ActivityList } from './ActivityList';
import { ActivityDetails } from '../details/ActivityDetails';
import { ActivityForm } from '../form/ActivityForm';


interface IProps {
    activities: IActivity[]
}

//instead of (props), we destructure the object and take out the properties we need
export const ActivityDashboard: React.FC<IProps> = ({ activities }) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities} />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetails />
                <ActivityForm />
            </Grid.Column>
        </Grid>
    )
}