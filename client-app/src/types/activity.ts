import { Profile } from "./profile";

export class Activity {
  id: string = '';
  title: string = '';
  date?: Date | null = null;
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';
  hostUsername: string | null = null;
  isCancelled?: boolean;
  isGoing?: boolean;
  isHost?: boolean;
  host?: Profile;
  attendees: Profile[] = []

  constructor(opts?: Partial<Activity>) {
    if (opts) {
      Object.assign(this, opts);
      if (opts.date) {
        this.date = Activity.DateStringToDate(opts.date as any);
      }
    }
  }

  public static DateStringToDate(dateStr: string) {
    let dateRetStr = dateStr;
    if (typeof dateStr === 'string' && dateStr.includes('T')) {
      dateRetStr = dateStr.split('T')[0];
    }
    return new Date(dateRetStr);
  }
}

export class ActivityFormValues {
  id?: string;
  title: string = '';
  category: string = '';
  description: string = '';
  date?: Date  | null = null;
  city: string = '';
  venue: string = '';

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      Object.assign(this, activity);
    }
  }
}