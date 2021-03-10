import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react'
import { Reveal, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { Profile } from '../../types/profile'

interface Props {
  profile: Profile;
}

export default observer(function FollowButton(props: Props) {
  const { profileStore, userStore } = useStore()

  if (userStore.user?.username === props.profile.username) return null;

  function handleFollow(e: SyntheticEvent, username: string) {
    e.preventDefault();
    if (props.profile.following) {
      profileStore.updateFollowing(username, false);
    } else {
      profileStore.updateFollowing(username, true);
    }
  }

  return (
    <Reveal animated='move'>
      <Reveal.Content visible style={{width: '100%'}}>
        <Button 
          fluid 
          color='blue' 
          content={props.profile.following ? 'Following' : 'Not following'}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{width: '100%'}}>
        <Button
          fluid
          basic
          color={props.profile.following ? 'red' : 'green' }
          content={props.profile.following ? 'Unfollow' : 'Follow'}
          loading={profileStore.isLoading}
          onClick={(e) => handleFollow(e, props.profile.username)}
        />
      </Reveal.Content>
  </Reveal>
  )
});
