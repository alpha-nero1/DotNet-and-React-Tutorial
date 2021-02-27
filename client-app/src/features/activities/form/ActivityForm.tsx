import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Segment, Form, Button } from 'semantic-ui-react';
import LoadingCircle from '../../../app/layout/LoadingCircle';
import { useStore } from '../../../app/stores/store';
import { Activity } from '../../../types/activity';
import { v4 as uuid } from 'uuid';

export default observer(function ActivityForm() {
  const history = useHistory();
  const { activityStore } = useStore();
  const { id } = useParams<{id: string}>();
  const [activity, setActivity] = useState<Activity>(new Activity());

  useEffect(() => {
    if (id) {
      activityStore.loadActivity(id)
      .then((at) => {
        if (at) {
          setActivity(at!);
        }
      });
    }
  }, [id, activityStore])

  function handleSubmit(): void {
    if (activity.id.length) {
      activityStore.updateActivity(activity)
      .then(() => {
        // This is how we navighate in component!
        history.push(`/activities/${activity.id}`);
      });
    } else {
        const newActivity = new Activity(activity);
        newActivity.id = uuid();
        activityStore.createActivity(newActivity)
        .then(() => {
          // This is how we navighate in component!
          history.push(`/activities/${newActivity.id}`);
        });
    }
  }

  function handleInputChange(ev: ChangeEvent<any>): void {
    const { name, value } = ev.target;
    setActivity(
      new Activity({
        ...activity,
        [name]: value
      })
    )
  }

  if (activityStore.isLoading) return <LoadingCircle content='Loading content...'/>

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete='off'>
        <Form.Input 
          placeholder='Title'
          value={activity.title}
          onChange={handleInputChange}
          name='title'
        />
        <Form.TextArea 
          placeholder='Description'
          value={activity.description}
          onChange={handleInputChange}
          name='description'
        />
        <Form.Input 
          placeholder='Category'
          value={activity.category}
          onChange={handleInputChange}
          name='category'
        />
        <Form.Input 
          placeholder='Date'
          value={activity.date}
          onChange={handleInputChange}
          name='date'
          type='date'
        />
        <Form.Input 
          placeholder='City'
          value={activity.city}
          onChange={handleInputChange}
          name='city'
        />
        <Form.Input 
          placeholder='Venue'
          value={activity.venue}
          onChange={handleInputChange}
          name='venue'
        />
        <Button 
          floated='right' 
          positive 
          type='submit' 
          content='Submit'
          loading={activityStore.isSubmitting}
        ></Button>
        <Button 
          floated='right'
          type='button'
          content='Cancel'
          as={Link}
          to='/activities'
        ></Button>
      </Form>
    </Segment>
  );
});