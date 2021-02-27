import React, { SyntheticEvent, useState } from 'react';
import { Segment, Item, Button, Label } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

export default observer(function ActivityList() {

  const [target, setTarget] = useState('');
  const { activityStore } = useStore();

  function handleDelete(event: SyntheticEvent<HTMLButtonElement>, id: string) {
    setTarget(event.currentTarget.name);
    activityStore.deleteActivity(id);
  }

  return (
    <Segment>
      <Item.Group divided>
        {activityStore.activitiesByDate.map(at => (
          <Item key={at.id}>
            <Item.Content>
              <Item.Header as='a'>
                {at.title}
              </Item.Header>
              <Item.Meta>
                {at.date}
              </Item.Meta>
              <Item.Description>
                <div>{at.description}</div>
                <div>{at.city}, {at.venue}</div>
              </Item.Description>
              <Item.Extra>
                <Button
                  as={Link}
                  to={`/activities/${at.id}`}
                  floated='right' 
                  content='View'
                  color='blue'
                />
                <Button
                  name={at.id}
                  onClick={(e) => handleDelete(e, at.id)}
                  floated='right'
                  content='Delete'
                  color='red'
                  loading={activityStore.isSubmitting && target === at.id}
                />
                <Label basic content={at.category}/>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
});