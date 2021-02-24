import React, { ChangeEvent, useState } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { Activity } from '../../../types/activity';

interface Props {
  activity: Activity | undefined;
  closeForm: () => void;
  handleActivityMutation: (activity: Activity) => void;
}

export default function ActivityForm(props: Props) {

  const initialState = props.activity ?? new Activity()
  const [activity, setActivity] = useState<Activity>(initialState);

  function handleSubmit(): void {
    props.handleActivityMutation(activity);
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
        ></Button>
        <Button 
          floated='right' 
          type='button' 
          content='Cancel'
          onClick={props.closeForm}
        ></Button>
      </Form>
    </Segment>
  );
}