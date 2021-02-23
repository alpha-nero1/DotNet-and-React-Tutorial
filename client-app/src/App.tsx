import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities')
    .then(({ data }) => {
      setActivities(data);
    })
    // Empty array ensures we only run this one time to avoid infinite loop.
  }, []);

  return (
    <div>
      <Header as='h2' icon="users" content="Reactivities" />
      <List>
          {activities.map((at: any) => (
            <List.Item key={at.id}>{ at.title }</List.Item>
          ))}
      </List>
    </div>
  );
}

export default App;
