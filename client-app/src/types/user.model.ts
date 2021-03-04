
export class User {
  username?: string;
  displayName?: string;
  image?: string;
  token?: string;

  constructor(opts: Partial<User>) {
    Object.assign(this, opts);
  }
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
}