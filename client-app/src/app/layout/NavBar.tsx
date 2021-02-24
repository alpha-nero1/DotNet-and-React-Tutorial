import React from 'react';
import { Menu, Container, MenuItem, Button } from 'semantic-ui-react';

interface Props {
  openForm: () => void;
}

export default function NavBar(props: Props) {
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img src="/assets/images/logo.png" alt="logo" style={{ marginRight: '10px' }}></img>
        </Menu.Item>
        <Menu.Item name="Activities"/>
        <Menu.Item>
          <Button 
            positive 
            content="Create Activity" 
            onClick={props.openForm}
          />
        </Menu.Item>
      </Container>
    </Menu>
  )
}