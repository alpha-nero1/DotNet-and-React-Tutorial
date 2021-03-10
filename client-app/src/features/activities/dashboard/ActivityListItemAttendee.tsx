import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react';
import { Profile } from '../../../types/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
  attendees: Profile[]
}

export default observer(function ActivityListItemAttendee(props : Props) {
  const followStyle = {
    borderColor: 'orange',
    borderWidth: 4
  }

  return (
    <List horizontal>
      {props.attendees.map(att => (
        <Popup
          hoverable
          key={att.username}
          trigger={
            <List.Item key={att.username} as={Link} to={`/profiles/${att.username}`}>
              <Image 
                size='mini' 
                circular 
                src={att.image || '/assets/Images/user.png'}
                bordered
                style={att.following ? followStyle : null}
              />
            </List.Item>
          }
        >
            <Popup.Content>
              <ProfileCard profile={att} />
            </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});
