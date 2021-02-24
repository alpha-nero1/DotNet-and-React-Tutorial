import React from 'react';
import { Activity } from '../../../types/activity';
import { Card, Button, Image } from 'semantic-ui-react';

interface Props {
  activity: Activity;
  cancelSelectedActivity: () => void;
  openForm: (id: string) => void;
}

export default function ActivityDetails(props : Props) {
  return (
    <Card fluid>
      <Image src={`/assets/Images/categoryImages/${props.activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{props.activity.title}</Card.Header>
        <Card.Meta>
          <span className='date'>{ props.activity.date }</span>
        </Card.Meta>
        <Card.Description>
          { props.activity.description }
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button
            onClick={() => props.openForm(props.activity.id)}
            color='blue' 
            content='Edit'
          />
          <Button
            onClick={props.cancelSelectedActivity}
            color='grey' 
            content='Cancel'
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
}