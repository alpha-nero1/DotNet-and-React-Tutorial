import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';
import { Activity } from '../../types/activity';
import NavBar from './NavBar';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(({ data }) => {
      setActivities(data);
    })
    // Empty array ensures we only run this one time to avoid infinite loop.
  }, []);

  return (
    <div>
      <NavBar />
      <Header as='h2' icon="users" content="Reactivities" />
      <List>
          {activities.map(at => (
            <List.Item key={at.id}>{ at.title }</List.Item>
          ))}
      </List>
    </div>
  );
}

export default App;
