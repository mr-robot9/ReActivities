import React, { useContext, useEffect } from 'react'
import {Grid}  from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import ActivityDetailedHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo  from './ActivityDetailedInfo'
import { ActivityDetailedChat } from './ActivityDetailedChat'
import { ActivityDetailedSidebar } from './ActivityDetailedSidebar'
import NotFound from '../../../app/layout/NotFound'
import { RootStoreContext } from '../../../app/stores/rootStore'

/*
This component handles the details view of a single selected Activity
*/

interface IDetailParams {
    id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<IDetailParams>> = ({ match, history }) => {
    const rootStore = useContext(RootStoreContext)
    const {activityStore} = rootStore
    const { selectedActivity, IsLoading } = activityStore;

    useEffect(() => {
        activityStore.loadActivity(match.params.id).catch( () => {
            history.push('/NotFound'); //a route that doesn't exist will go to last route in app.tsx
        })
    }, [activityStore, match.params.id, history])

    if (IsLoading) {

        return <LoadingComponent content="Loading Activity" />
    }

    if (!selectedActivity) return <NotFound />



    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={selectedActivity} />
                <ActivityDetailedInfo activity={selectedActivity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar attendees ={selectedActivity.attendees}/>
            </Grid.Column>
        </Grid>
    )
}
export default observer(ActivityDetails);