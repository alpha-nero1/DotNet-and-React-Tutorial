import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { Profile } from '../../types/profile';
import ProfileActivities from './ProfileActivities';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
  const { profileStore } = useStore();
  const panes = [
    { menuItem: 'About', render: () => <Tab.Pane>About Me</Tab.Pane> },
    { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile}/> },
    { menuItem: 'Activities', render: () => <ProfileActivities /> },
    { menuItem: 'Followers', render: () => <ProfileFollowings /> },
    { menuItem: 'Following', render: () => <ProfileFollowings /> }
  ]
  return (
    <Tab
      menu={{fluid: true, vertical: true}}
      menuPosition='right'
      panes={panes}
      onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex as number)}
    />
  );
});
