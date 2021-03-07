import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../types/activity';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {

  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label attached='top' content='Cancelled' style={{textAlign: 'center'}} color='red'/>
        )}
        <Item.Group>
          <Item>
            <Item.Image size='tiny' style={{ marginBottom: 4 }} circular src='/assets/Images/user.png' />
            <Item.Content>
              <Item.Header
                as={Link}
                to={`/activities/${activity.id}`}
              >
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by {activity.host?.displayName}
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label color='orange'>You are hosting this activity!</Label>
                </Item.Description>
              )}
              {activity.isGoing && (
                <Item.Description>
                  <Label color='green'>You are going to this activity!</Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> { format(activity.date as Date, 'dd MMM yyyy h:mm aa') }
          <Icon name='marker' /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees}/>
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          color='blue'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  );
}