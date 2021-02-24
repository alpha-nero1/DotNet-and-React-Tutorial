export class Activity {
  id: string = '';
  title: string = '';
  date: string = '';
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';

  constructor(opts?: Partial<Activity>) {
    if (opts) {
      Object.assign(this, opts);
    }
  }
}