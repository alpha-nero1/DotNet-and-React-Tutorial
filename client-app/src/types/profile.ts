import { User } from "./user.model";

export class Profile {
  username: string;
  displayName: string;
  bio: string | null = null;
  image?: string
  photos: Photo[] = [];

  constructor(user: User) {
    this.username = user.username as string;
    this.displayName = user.displayName as string;
    this.image = user.image;
  }
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}