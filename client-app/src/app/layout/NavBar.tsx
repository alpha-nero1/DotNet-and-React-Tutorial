import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Container, Button } from 'semantic-ui-react';

export default function NavBar() {

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
      </Container>
    </Menu>
  )
}