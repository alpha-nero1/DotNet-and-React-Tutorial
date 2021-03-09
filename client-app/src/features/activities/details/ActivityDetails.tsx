import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingCircle from '../../../app/layout/LoadingCircle';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsChat from './ActivityDetailsChat';
import ActivityDetailsSidebar from './ActivityDetailsSidebar';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity: activity } = activityStore;
  const { id } = useParams<{id: string}>();

  useEffect(() => {
    if (id) {
      activityStore.loadActivity(id);
    }
    return () => {
      activityStore.clearSelectedActivity()
    }
  }, [id, activityStore])

  if (activityStore.isLoading || !activity) return <LoadingCircle />;
  
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat activityId={activity?.id}/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailsSidebar activity={activity}/>
      </Grid.Column>
    </Grid>
  );
});
