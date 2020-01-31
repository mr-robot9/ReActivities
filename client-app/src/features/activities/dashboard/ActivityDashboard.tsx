import React from 'react'
import { Grid } from 'semantic-ui-react';
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
    handleCreateActivity: (activity: IActivity) => void;
    handleEditActivity: (activity: IActivity) => void;
    handleDeleteActivity: (id: string) => void;

}

/*
This component acts as the middleman between App.tsx and activity related features
Allowing state properties to be passed through
*/


//instead of (props), we destructure the object and take out the properties we need
export const ActivityDashboard: React.FC<IProps> = ({ 
    activities, 
    handleSelectActivity, 
    selectedActivity, 
    handleEditCreateToggle, 
    IsEditCreateMode,
    handleCreateActivity,
    handleEditActivity,
    handleDeleteActivity
}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities} handleSelectActivity={handleSelectActivity} handleDeleteActivity = {handleDeleteActivity}/>
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && <ActivityDetails selectedActivity={selectedActivity} handleSelectActivity = {handleSelectActivity} handleEditCreateToggle = {handleEditCreateToggle}/>}
                {IsEditCreateMode && 
                    <ActivityForm 
                        key = {selectedActivity && selectedActivity.id || 0}
                        handleEditCreateToggle = {handleEditCreateToggle} 
                        selectedActivity = {selectedActivity!} 
                        handleSelectActivity = {handleSelectActivity} 
                        handleCreateActivity = {handleCreateActivity}
                        handleEditActivity = {handleEditActivity}
                    />  }
            </Grid.Column>
        </Grid>
    )
}
