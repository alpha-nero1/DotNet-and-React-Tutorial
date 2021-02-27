import { makeAutoObservable } from "mobx"
import { Activity } from "../../types/activity";
import agent from "../api/agent";

export default class ActivityStore {

  activityRegister = new Map<string, Activity>();

  selectedActivity: Activity | undefined;

  isEditing = false;

  isLoading = true;

  isSubmitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegister.values())
      .sort((a, b) => (
        Date.parse(a.date) - Date.parse(b.date)
      ));
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
    this.selectedActivity = at;
  }

  createActivity = (activity: Activity) => {
    this.setIsSubmitting(true);
    return agent.Activities.create(activity)
    .then(() => {
      const newActivity = new Activity({
        ...activity
      })
      this.activityRegister.set(activity.id, newActivity);
      this.setIsEditing(false);
      this.setSelectedActivity(activity);
      this.setIsSubmitting(false);
    })
    .catch((err) => {
      this.setIsSubmitting(false);
      throw err;
    });
  }

  updateActivity = (activity: Activity) => {
    this.setIsSubmitting(true);
    return agent.Activities.update(activity)
    .then(() => {
      this.activityRegister.set(activity.id, activity);
      this.setIsEditing(false);
      this.setSelectedActivity(activity);
      this.setIsSubmitting(false);
    })
    .catch((err) => {
      this.setIsSubmitting(false);
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
}