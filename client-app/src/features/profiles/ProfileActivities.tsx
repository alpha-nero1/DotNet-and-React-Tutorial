import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Card, Grid, Header, Image, Tab, TabProps } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

const panes = [
  { menuItem: 'Future events', pane: { key: 'future' } },
  { menuItem: 'Past events', pane: { key: 'past' } },
  { menuItem: 'Hosting', pane: { key: 'hosting' } }
];

export default observer(function ProfileActivities() {
  const { profileStore } = useStore();
  const {
    loadUserActivities,
    profile,
    isLoadingActivities,
    userActivities
  } = profileStore;

  useEffect(() => {
    if (profile) {
      loadUserActivities(profile.username);
    }
  }, [loadUserActivities, profile]);

  const handleTabChange = (e: any, data: TabProps) => {
    if (profile) {
      loadUserActivities(profile.username, panes[data.activeIndex as number].pane.key);
    }
  }

  return (
    <Tab.Pane loading={isLoadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content='Activities' />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab 
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br/>
          <Card.Group itemsPerRow={4}>
            {userActivities.map(att => (
              <Card 
                as={Link}
                to={`/activities/${att.id}`}
                key={att.id}
              >
                <Image
                  src={`/assets/Images/categoryImages/${att.category}.jpg`}
                  style={{minHeight: 100, objectFit: 'cover'}}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{att.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(att.date), 'do LLL')}</div>
                    <div>{format(new Date(att.date), 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
});
