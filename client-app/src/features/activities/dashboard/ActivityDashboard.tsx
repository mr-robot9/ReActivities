import React, { useContext, useEffect, useState } from 'react';
import { Grid, Button, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';

import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

/*
This component acts as the middleman between App.tsx and activity related features
Allowing state properties to be passed through
*/

//instead of (props), we destructure the object and take out the properties we need
const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activityStore } = rootStore;
  const { setPage, page, totalPages } = activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    activityStore.loadActivities().then(() => setLoadingNext(false));
  };

  //second param ([]) is set empty bc we're telling react to not run this method again
  //we're using it doesn't depend on any values from props or state so no re-run
  useEffect(() => {
    console.log('getting list');
    activityStore.loadActivities();
  }, [activityStore]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {activityStore.IsLoading && page == 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages} //!loadingNext bc we don't want to load if currently loading next
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
