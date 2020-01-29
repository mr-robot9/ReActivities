import React from 'react'
import { Grid, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { ActivityList } from './ActivityList';
import { ActivityDetails } from '../details/ActivityDetails';
import { ActivityForm } from '../form/ActivityForm';


interface IProps {
    activities: IActivity[];
    handleSelectActivity: (id: string | null) => void;
    selectedActivity: IActivity | null;
    handleEditCreateToggle: () => void;
    IsEditCreateMode: boolean;
}

/*
This component acts as the middleman between App.tsx and activity related features
Allowing state properties to be passed through
*/


//instead of (props), we destructure the object and take out the properties we need
export const ActivityDashboard: React.FC<IProps> = ({ activities, handleSelectActivity, selectedActivity, handleEditCreateToggle, IsEditCreateMode}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities} handleSelectActivity={handleSelectActivity}/>
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && <ActivityDetails selectedActivity={selectedActivity} handleSelectActivity = {handleSelectActivity} handleEditCreateToggle = {handleEditCreateToggle}/>}
                {IsEditCreateMode && <ActivityForm handleEditCreateToggle = {handleEditCreateToggle} selectedActivity = {selectedActivity!} handleSelectActivity = {handleSelectActivity} />  }
            </Grid.Column>
        </Grid>
    )
}
