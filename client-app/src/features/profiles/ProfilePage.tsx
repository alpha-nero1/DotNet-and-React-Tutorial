import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingCircle from '../../app/layout/LoadingCircle';
import { useStore } from '../../app/stores/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

export default observer(function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { profileStore } = useStore();
  const { isLoadingProfile, loadProfile, profile } = profileStore;

  useEffect(() => {
    loadProfile(username)
    return () => {
      profileStore.setActiveTab(0);
    }
  }, [profileStore, loadProfile, username])

  if (isLoadingProfile) return <LoadingCircle content='Loading profile...'/>

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && <ProfileHeader profile={profile} />}
        {profile && <ProfileContent profile={profile} />}
      </Grid.Column>
    </Grid>
  );
});
