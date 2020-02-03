import React from 'react'
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    activities: IActivity[];
    handleSelectActivity: (id: string) => void;
    handleDeleteActivity: (id: string) => void;
    IsSubmitting: boolean;
}

export const ActivityList: React.FC<IProps> = ({ activities, handleSelectActivity, handleDeleteActivity, IsSubmitting }) => {
    return (
        <Segment clearing>
            <Item.Group divided>
                {
                activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>

                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => {
                                    console.log("hello" + activity.id);
                                    handleSelectActivity(activity.id)
                                }}
                                    floated='right' content='View' color='blue' />
                                <Button loading={IsSubmitting} onClick={() => {
                                    console.log("hello" + activity.id);
                                    handleDeleteActivity(activity.id)
                                }}
                                    floated='right' content='Delete' color='red' />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))
                }

            </Item.Group>
        </Segment>

    )
}
