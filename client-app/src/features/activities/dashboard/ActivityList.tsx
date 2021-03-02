import React, { Fragment } from 'react';
import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';

export default observer(function ActivityList() {

  const { activityStore } = useStore();

  return (
    <>
      {activityStore.groupedActivities.map(([key, activities]) => (
        <Fragment key={key}>
          <Header sub color='blue'><h2>{key}</h2></Header>
          {activities.map(at => (
            <ActivityListItem key={at.id} activity={at}/>
          ))}
        </Fragment>
      ))}
    </>
  );
});