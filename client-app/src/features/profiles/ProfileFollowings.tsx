import { observer } from 'mobx-react-lite'
import React from 'react'
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store'
import ProfileCard from './ProfileCard';

export default observer(function ProfileFollowings() {
  const { profileStore } = useStore();

  return (
    <Tab.Pane loading={profileStore.isLoadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header 
            floated='right' 
            icon='user' 
            content={profileStore.activeTab === 3 ? `People following ${profileStore.profile?.displayName}` : `People followed ${profileStore.profile?.displayName}`}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {profileStore.followings.map(profile => (
              <ProfileCard key={profile.username} profile={profile}/>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
})
