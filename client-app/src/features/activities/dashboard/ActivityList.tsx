import React, { useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { ActivityListItem } from "./ActivityListItem";
import { RootStoreContext } from "../../../app/stores/rootStore";
import {format} from 'date-fns'

const ActivityList: React.FC = () => {

  
  const rootStore = useContext(RootStoreContext);
  
  const {activityStore} = rootStore;
  const { activitiesByDate } = activityStore;

  return (
    <Fragment>
      {Array.from(activitiesByDate).map(([dateKey, activities]) => (
        <Fragment key={dateKey}>
          <Label size='large' color='blue'>
            {format(dateKey, 'eeee do MMMM')}
          </Label>
          <Item.Group divided>
            {activities.map(activity => (
              <ActivityListItem key={activity.id} activity={activity} />

            ))}
          </Item.Group>

        </Fragment>
      ))}
    </Fragment>

  );
};

export default observer(ActivityList);