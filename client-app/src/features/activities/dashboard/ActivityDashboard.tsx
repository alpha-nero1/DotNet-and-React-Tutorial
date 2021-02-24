import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../types/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  isEditing: boolean;
  setSelectedActivity: (id: string) => void;
  cancelActivity: () => void;
  openForm: (id: string) => void;
  closeForm: () => void;
  handleActivityMutation: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

export default function ActivityDashboard(props : Props) {
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList 
          activities={props.activities}
          selectActivity={props.setSelectedActivity}
          deleteActivity={props.deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width='6'>
        { 
          (props.selectedActivity && !props.isEditing) &&
          <ActivityDetails 
            activity={props.selectedActivity}
            cancelSelectedActivity={props.cancelActivity}
            openForm={props.openForm}
          />
        }
        {
          props.isEditing &&
          <ActivityForm 
            activity={props.selectedActivity} 
            closeForm={props.closeForm}
            handleActivityMutation={props.handleActivityMutation}
          />
        }
      </Grid.Column>
    </Grid>
  );
}