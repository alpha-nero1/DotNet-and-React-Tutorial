import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Container, Button, Image, Dropdown } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default observer(function NavBar() {
  const { userStore } = useStore();

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} to='/' exact header>
          <img src="/assets/images/logo.png" alt="logo" style={{ marginRight: '10px' }}></img>
          <p>Reactivities</p>
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} exact to='/activities'/>
        <Menu.Item name="Errors" as={NavLink} exact to='/errors'/>
        <Menu.Item>
          <Button 
            positive 
            content="Create Activity"
            as={NavLink} 
            to='/activities/create/new'
          />
        </Menu.Item>
        <Menu.Item position='right'>
          <Image src={userStore.user?.image || '/assets/Images/user.png'} spaced='right' avatar />
          <Dropdown pointing='top left' text={userStore?.user?.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item 
                as={Link} 
                to={`/profile/${userStore?.user?.username}`} 
                text='My profile' 
                icon='user' 
              />
              <Dropdown.Item 
                onClick={userStore.logout} 
                icon='power' 
                text='Logout' 
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  )
});
