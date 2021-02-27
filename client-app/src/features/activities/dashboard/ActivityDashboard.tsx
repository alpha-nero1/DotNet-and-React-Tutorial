import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingCircle from '../../../app/layout/LoadingCircle';
import ActivityFilters from './ActivityFilters';

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { activityRegister, loadActivities } = activityStore;

  useEffect(() => {
    if (activityRegister.size <= 1) loadActivities();
  }, [activityRegister.size, loadActivities]);

  if (activityStore.isLoading) {
    return <LoadingCircle />
  }

  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
})