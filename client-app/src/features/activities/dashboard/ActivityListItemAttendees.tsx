import React from 'react'
import { List, Image, Popup} from 'semantic-ui-react'
import { IActivityAttendee } from '../../../app/models/activity'

interface IProps {
    attendees: IActivityAttendee[];
}

export const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
    return (
        <List horizontal>
            {attendees.map((attendee) => (
                <List.Item key={attendee.username}>
                    <Popup header={attendee.displayName} trigger = {<Image size='mini' circular src={attendee.image || '/Assets/Images/user.png'} />}/>
                </List.Item>
            ))}
        </List>
    )
}
