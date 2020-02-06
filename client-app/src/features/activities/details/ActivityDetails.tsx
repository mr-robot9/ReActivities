import React, { useContext, useEffect } from 'react'
import {Grid}  from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import ActivityDetailedHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo  from './ActivityDetailedInfo'
import { ActivityDetailedChat } from './ActivityDetailedChat'
import { ActivityDetailedSidebar } from './ActivityDetailedSidebar'

/*
This component handles the details view of a single selected Activity
*/

interface IDetailParams {
    id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<IDetailParams>> = ({ match }) => {
    const activityStore = useContext(ActivityStore)
    const { selectedActivity, IsLoading } = activityStore;

    useEffect(() => {
        activityStore.loadActivity(match.params.id)
    }, [activityStore, match.params.id])

    if (IsLoading || !selectedActivity) return <LoadingComponent content="Loading Activity" />


    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={selectedActivity} />
                <ActivityDetailedInfo activity={selectedActivity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    )
}
export default observer(ActivityDetails);