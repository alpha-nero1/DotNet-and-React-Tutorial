export interface ChatComment {
  id: number;
  createdAt: Date;
  body: string;
  username: string;
  disaplayName: string;
  image: string;
}

export class ChatComment implements ChatComment {
  constructor(opts?: Partial<ChatComment>) {
    if (opts) {
      Object.assign(this, opts);
      if (opts.createdAt) {
        this.createdAt = new Date(opts.createdAt);
      }
    }
  }
}