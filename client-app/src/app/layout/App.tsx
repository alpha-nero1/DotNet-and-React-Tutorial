import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../../types/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingCircle from './LoadingCircle';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    setIsSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity)
      .then(res => {
        setActivities([...activities.filter(at => at.id !== activity.id), activity])
        setIsEditing(false);
        setSelectedActivity(activity);
        setIsSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity)
      .then(() => {
        const newActivity = new Activity({
          ...activity
        })
        setActivities([...activities, newActivity]);
        setIsEditing(false);
        setSelectedActivity(activity);
        setIsSubmitting(false);
      });
    }
    
  }

  function handleDeleteActivity(id: string) {
    setIsSubmitting(true);
    agent.Activities.delete(id)
    .then(res => {
      setActivities([...activities.filter(at => at.id !== id)]);
      setIsSubmitting(false);
    });
  }

  useEffect(() => {
    agent.Activities.list()
    .then((data) => {
      setActivities(data.map(at => new Activity(at)));
      setIsLoading(false);
    })
    // Empty array ensures we only run this one time to avoid infinite loop.
  }, []);

  if (isLoading) {
    return <LoadingCircle />
  }

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
          isSubmitting={isSubmitting}
        />
      </Container>
    </>
  );
}

export default App;
