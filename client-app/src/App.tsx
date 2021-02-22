import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          {activities.map((at: any) => (
            <li key={at.id}>{ at.title }</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
