import React, { useContext, useEffect } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps, Link } from 'react-router-dom'
import LoadingComponent from '../../../app/layout/LoadingComponent'

/*
This component handles the details view of a single selected Activity
*/

interface IDetailParams{
    id : string;
}

const ActivityDetails : React.FC<RouteComponentProps<IDetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore)
    const {selectedActivity, IsLoading} = activityStore;

    useEffect(() => {
        activityStore.loadActivity(match.params.id)
    }, [activityStore, match.params.id])

    if (IsLoading || !selectedActivity) return <LoadingComponent content = "Loading Activity"/>


    return (
        <Card fluid>
            <Image src={`/Assets/Images/categoryImages/${selectedActivity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{selectedActivity!.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{selectedActivity!.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity!.description}
          </Card.Description>
            </Card.Content>
            <Card.Content extra>
               <Button.Group widths={2}>
                   <Button as={Link} to={`/manage/${selectedActivity.id}`} basic color='blue' content='Edit'/>
                   <Button onClick= { () => history.push('/activities')}  basic color='grey' content='Cancel'/>

               </Button.Group>
            </Card.Content>
        </Card>
    )
}
export default observer(ActivityDetails);