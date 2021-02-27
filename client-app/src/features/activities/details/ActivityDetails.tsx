import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Image } from 'semantic-ui-react';
import LoadingCircle from '../../../app/layout/LoadingCircle';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity: activity } = activityStore;
  const { id } = useParams<{id: string}>();

  useEffect(() => {
    if (id) {
      activityStore.loadActivity(id);
    }
  }, [id, activityStore])

  if (activityStore.isLoading || !activity) return <LoadingCircle />;
  
  return (
    <Card fluid>
      <Image src={`/assets/Images/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span className='date'>{ activity.date }</span>
        </Card.Meta>
        <Card.Description>
          { activity.description }
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button
            color='blue' 
            content='Edit'
            basic
            as={Link}
            to={`/activities/manage/${activity.id}`}
          />
          <Button
            color='grey' 
            content='Cancel'
            as={Link}
            to={'/activities'}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
});
