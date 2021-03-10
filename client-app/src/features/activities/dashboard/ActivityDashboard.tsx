import React, { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingCircle from '../../../app/layout/LoadingCircle';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../types/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { activityRegister, loadActivities, setPagingParams, pagination } = activityStore;
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>();

  function handleGetnext() {
    setIsLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities()
      .then(() => setIsLoadingNext(false))
  }

  useEffect(() => {
    if (activityRegister.size <= 1) loadActivities();
  }, [activityRegister.size, loadActivities]);

  return (
    <Grid>
      <Grid.Column width='10'>
        {(activityStore.isLoading && !isLoadingNext) ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetnext}
            hasMore={Boolean(!isLoadingNext && pagination && (pagination?.currentPage < pagination?.totalPages))}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader actve={isLoadingNext}/>
      </Grid.Column>
    </Grid>
  );
})