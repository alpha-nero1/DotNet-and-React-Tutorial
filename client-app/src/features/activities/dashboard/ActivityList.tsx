import React from 'react';
import { Activity } from '../../../types/activity';
import { Segment, Item, Button, Label } from 'semantic-ui-react';

interface Props {
  activities: Activity[]
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

export default function ActivityList(props : Props) {
  return (
    <Segment>
      <Item.Group divided>
        {props.activities.map(at => (
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
                  onClick={() => props.selectActivity(at.id)}
                  floated='right' 
                  content='View'
                  color='blue'
                />
                <Button
                  onClick={() => props.deleteActivity(at.id)}
                  floated='right'
                  content='Delete'
                  color='red'
                />
                <Label basic content={at.category}/>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}