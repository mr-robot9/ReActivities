import React from 'react';
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import { format } from 'date-fns';
import { ActivityListItemAttendees } from './ActivityListItemAttendees';

export const ActivityListItem: React.FC<{ activity: IActivity }> = ({
  activity
}) => {
  const host = activity.attendees.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={host.image || '/Assets/Images/user.png'}
            ></Item.Image>
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Meta>{format(activity.date!, 'h:mm a')}</Item.Meta>
              <Item.Description>
                Hosted By{' '}
                <Link to={`/profile/${host.username}`}>{host.displayName}</Link>
              </Item.Description>
              <Item.Description>
                {activity.isHost && (
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this activity"
                  />
                )}
              </Item.Description>
              <Item.Description>
                {activity.isGoing && !activity.isHost && (
                  <Label
                    basic
                    color="green"
                    content="You are going to this activity"
                  />
                )}
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(activity.date!, 'h:mm a')}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};
