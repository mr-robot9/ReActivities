import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';

import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityStore from '../../../app/stores/activityStore';


/*
This component acts as the middleman between App.tsx and activity related features
Allowing state properties to be passed through
*/


//instead of (props), we destructure the object and take out the properties we need
const ActivityDashboard: React.FC = () => {

    const activityStore = useContext(ActivityStore)


    //second param ([]) is set empty bc we're telling react to not run this method again
    //we're using it doesn't depend on any values from props or state so no re-run
    useEffect(() => {
      console.log("getting list");
      activityStore.loadActivities();
    }, [activityStore]);
  
    //gets called before useEffect
    if (activityStore.IsLoading) {
      console.log("loading");
      return <LoadingComponent content="Loading Activity" />
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Filter</h2>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);
