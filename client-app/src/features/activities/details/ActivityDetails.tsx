import React from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    selectedActivity: IActivity;
    handleEditCreateToggle: () => void;
    handleSelectActivity: (id: string | null) => void;
}

/*
This component handles the details view of a single selected Activity
*/

export const ActivityDetails : React.FC<IProps> = ({selectedActivity, handleEditCreateToggle, handleSelectActivity}) => {


    return (
        <Card fluid>
            <Image src={`/Assets/Images/categoryImages/${selectedActivity.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{selectedActivity.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{selectedActivity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity.description}
          </Card.Description>
            </Card.Content>
            <Card.Content extra>
               <Button.Group widths={2}>
                   <Button onClick={handleEditCreateToggle} basic color='blue' content='Edit'/>
                   <Button onClick= { () => handleSelectActivity(null)}  basic color='grey' content='Cancel'/>

               </Button.Group>
            </Card.Content>
        </Card>
    )
}
