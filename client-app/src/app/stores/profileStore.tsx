import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../../types/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  isLoadingProfile = false;
  isUploading = false;
  isLoading = false;
  isLoadingFollowings = false;
  followings: Profile[] = [];
  activeTab = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'followings'
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    )
  }

  get isCurrentUser(): boolean {
    return (store?.userStore?.user?.username === this.profile?.username);
  }

  setActiveTab = (activeTab: number) => {
    this.activeTab = activeTab;
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

  updateFollowing = async (username: string, newFollowing: boolean) => {
    this.isLoading = true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (this.profile && this.profile.username === username) {
          if (username === store.userStore.user?.username) {

          } else {
            newFollowing ? this.profile.followersCount!++ : this.profile.followersCount!--;
            this.profile.following = !this.profile.following;
          }
          if (this.profile && this.profile.username === store.userStore.user?.username) {
            newFollowing ? this.profile.followingCount!++ : this.profile.followingCount!--
          }
          this.followings.forEach(p => {
            if (p.username === username) {
              p.following ? p.followersCount!-- : p.followersCount!++
              p.following = !p.following
            }
          })
        }
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => this.isLoading = false)
      throw err;
    }
  }

  loadFollowings = async (predicate: string) => {
    this.isLoadingFollowings = true;
    try {
      const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
      runInAction(() => {
        this.followings = followings;
        this.isLoadingFollowings = false;
      })
    } catch (err) {
      runInAction(() => this.isLoadingFollowings = false);
      throw err;
    }
  }
}