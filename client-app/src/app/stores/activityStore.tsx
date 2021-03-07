import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx"
import { Activity, ActivityFormValues } from "../../types/activity";
import { Profile } from "../../types/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ActivityStore {

  activityRegister = new Map<string, Activity>();

  selectedActivity: Activity | undefined;

  isEditing = false;

  isLoading = false;

  isSubmitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegister.values())
      .sort((a, b) => (
        a.date!.getTime() - b.date!.getTime()
      ));
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate
      .reduce((activities, at) => {
        const date = format(at.date!, 'dd MMM yyyy');
        activities[date] = activities[date] || [];
        activities[date].push(at)
        return activities;
      }, {} as { [key: string]: Activity[] })
    )
  }

  loadActivities = () => {
    this.setIsLoading(true);
    agent.Activities.list()
    .then((data) => {
      this.setActivities(data.map(at => new Activity(at)));
      this.setIsLoading(false);
    })
    .catch((err) => {
      this.setIsLoading(false);
      throw err;
    })
  }

  loadActivity = (id: string) => {
    let at = this.activityRegister.get(id);
    if (at) {
      this.setSelectedActivity(at);
      return Promise.resolve(at);
    } else {
      this.setIsLoading(true);
      return agent.Activities.details(id)
      .then(act => {
        act.date = Activity.DateStringToDate(act.date as any);
        this.activityRegister.set(act.id, act);
        this.setSelectedActivity(act);
        this.setIsLoading(false);
        return act;
      })
      .catch((err) => {
        this.setIsLoading(false);
        throw err;
      })
    }
  }

  setIsEditing = (editing: boolean) => {
    this.isEditing = editing;
  }

  setIsSubmitting = (submitting: boolean) => {
    this.isSubmitting = submitting;
  }

  setIsLoading = (loading: boolean) => {
    this.isLoading = loading;
  }

  setActivities = (activities: Activity[]) => {
    this.activityRegister = new Map<string, Activity>(
      activities.map(at => [at.id, at])
    );
  }

  setSelectedActivity = (at: Activity) => {
    const user = store.userStore.user;
    if (user) {
      at.isGoing = at.attendees.some(a => a.username === user.username);
      at.isHost = at.hostUsername === user.username
      at.host = at.attendees.find(a => a.username === at.hostUsername);
      this.selectedActivity = at;
    }
  }

  createActivity = (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    return agent.Activities.create(activity)
    .then(() => {
      const newActivity = new Activity({
        ...activity
      })
      newActivity.hostUsername = user!.username as string;
      newActivity.attendees = [attendee];
      this.setSelectedActivity(newActivity);
    })
    .catch((err) => {
      throw err;
    });
  }

  updateActivity = (activityForm: ActivityFormValues) => {
    return agent.Activities.update(activityForm)
    .then(() => {
      if (activityForm.id) {
        let updatedAtt = {
          ...this.selectedActivity,
          ...activityForm
        };
        const att = new Activity(updatedAtt);
        this.activityRegister.set(att.id as string, att);
        this.setSelectedActivity(att);
      }
    })
    .catch((err) => {
      throw err;
    })
  }

  deleteActivity = (id: string) => {
    this.setIsSubmitting(true);
    agent.Activities.delete(id)
    .then(() => {
      this.activityRegister.delete(id);
      this.setIsSubmitting(false);
    })
    .catch((err) => {
      this.setIsSubmitting(false);
      throw err;
    })
  }

  // Update the attendance for the current user.
  // Leverages the ! a lot because contextually we should only bve able to do this
  // if we have sel activity.
  updateAttendance = async () => {
    const user = store.userStore.user;
    this.setIsSubmitting(true);
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        // Set attendance props.
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = 
            this.selectedActivity.attendees
            .filter(item => item.username !== user?.username);
          this.selectedActivity.isGoing = false;
        } else {
          // We are toggling the other way.
          const att = new Profile(user!);
          this.selectedActivity?.attendees.push(att);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegister.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (e) {
      throw e;
    } finally {
      runInAction(() => this.setIsSubmitting(false));
    }
  }

  cancelActivityToggle = async () => {
    this.isSubmitting = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activityRegister.set(this.selectedActivity!.id, this.selectedActivity!);
      })
    } catch (e) {
      throw e;
    } finally {
      this.isSubmitting = false;
    }
  }
}