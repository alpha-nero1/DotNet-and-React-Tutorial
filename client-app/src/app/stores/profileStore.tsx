import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../../types/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  isLoadingProfile = false;
  isUploading = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser(): boolean {
    return (store?.userStore?.user?.username === this.profile?.username);
  }

  loadProfile = async (username: string) => {
    this.isLoadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.isLoadingProfile = false;
      })
    } catch (e) {
      runInAction(() => this.isLoadingProfile = false);
    }
  }

  uploadPhoto = async (file: Blob) => {
    this.isUploading = true;
    try {
      const res = await agent.Profiles.uploadPhoto(file);
      const photo = res.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          // Update main photo if applicable.
          if (photo.isMain && store.userStore.user) {
            store.userStore.setProfileImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.isUploading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.isUploading = false;
      });
    }
  }

  setMainPhoto = async (photo: Photo) => {
    this.isLoading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setProfileImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find(p => p.isMain)!.isMain = false;
          this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.isLoading = false;
        }
      })
    } catch (e) {
      runInAction(() => this.isLoading = false);
      throw e;
    }
  }

  deletePhoto = async (photo: Photo) => {
    this.isLoading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id)
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
          this.isLoading = false;
        }
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false;
      })
      throw e;
    }
  }
}