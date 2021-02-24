import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../../types/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function handleSelectActivity(id: string): void {
    setSelectedActivity(activities.find(at => at.id === id));
  }

  function handleCancelSelectActivity(): void {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string): void {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setIsEditing(true);
  }

  function handleFormClose(): void {
    setIsEditing(false);
  }

  function handleActivityMutation(activity: Activity): void {
    if (activity.id) {
      setActivities([...activities.filter(at => at.id !== activity.id), activity])
    } else {
      const newActivity = new Activity({
        ...activity,
        id: uuid()
      })
      setActivities([...activities, newActivity]);
    }
    setIsEditing(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(at => at.id !== id)]);
  }

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(({ data }) => {
      setActivities(data);
    })
    // Empty array ensures we only run this one time to avoid infinite loop.
  }, []);

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selActivity}
          setSelectedActivity={handleSelectActivity}
          cancelActivity={handleCancelSelectActivity}
          isEditing={isEditing}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          handleActivityMutation={handleActivityMutation}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
