import React, { SyntheticEvent } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activities: IActivity[];
  handleSelectActivity: (id: string) => void;
  handleDeleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  IsSubmitting: boolean;
  target: String;
}

export const ActivityList: React.FC<IProps> = ({
  activities,
  handleSelectActivity,
  handleDeleteActivity,
  IsSubmitting,
  target
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(activity => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => {
                    handleSelectActivity(activity.id);
                  }}
                  floated="right"
                  content="View"
                  color="blue"
                />
                <Button
                  name={activity.id}
                  loading={target === activity.id && IsSubmitting}
                  onClick={(event) => {
                    handleDeleteActivity(event, activity.id);
                  }}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};
