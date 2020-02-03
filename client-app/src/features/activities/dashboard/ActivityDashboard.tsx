import React, { useContext } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';


/*
This component acts as the middleman between App.tsx and activity related features
Allowing state properties to be passed through
*/


//instead of (props), we destructure the object and take out the properties we need
const ActivityDashboard: React.FC = () => {

    const activityStore = useContext(ActivityStore)
    const {IsEditCreateMode, selectedActivity} = activityStore;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && <ActivityDetails />}
                {IsEditCreateMode && 
                    <ActivityForm 
                        key = {selectedActivity && selectedActivity.id || 0}
                    />  }
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);
