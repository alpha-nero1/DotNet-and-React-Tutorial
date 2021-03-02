export class Activity {
  id: string = '';
  title: string = '';
  date?: Date | null = null;
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';

  constructor(opts?: Partial<Activity>) {
    if (opts) {
      Object.assign(this, opts);
      if (opts.date) {
        this.date = new Date(opts.date);
      }
    }
  }
}