import { RootStore } from './rootStore';
import { observable, action, runInAction, computed, reaction } from 'mobx';
import { ProfileService } from '../api/agent';
import { IProfile, IPhoto } from '../models/profile';
import { toast } from 'react-toastify';
import {
  IProfileAboutFormValues,
  IUserActivity
} from '../models/interfaces/IProfile';

export default class ProfileStore {
  rootStore: RootStore;

  /**
   *
   */
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    //react to changed observable
    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'followings';
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }
  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab = 0;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingActivities = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    }
    return false;
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingActivities = true;
    try {
      const activities = await ProfileService.listActivities(
        username,
        predicate!
      );

      runInAction(() => {
        this.userActivities = activities;
        this.loadingActivities = false;
      });
    } catch (error) {
      toast.error('Problem Loading Activities');
      runInAction(() => {
        this.loadingActivities = false;
      });
    }
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await ProfileService.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await ProfileService.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);

          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem uploading photo');
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await ProfileService.setMainPhoto(photo.id);

      runInAction(() => {
        //update user object, photos array, and profile image
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(a => a.isMain)!.isMain = false;
        this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem setting photo as main');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await ProfileService.deletePhoto(photo.id);

      runInAction(() => {
        //remove photo from profile photos array, since that's the only state we actually SEE
        //all the other states that have the photo still will NOT anymore on reload
        this.profile!.photos = this.profile!.photos.filter(
          a => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem deleting photo');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profileForm: IProfileAboutFormValues) => {
    this.loading = true;
    try {
      await ProfileService.updateProfile(profileForm);

      runInAction(() => {
        //update user object and profile display name/bio
        this.rootStore.userStore.user!.displayName = profileForm.displayName;
        this.profile!.displayName = profileForm.displayName;
        this.profile!.bio = profileForm.bio;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem deleting photo');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      const profileThatFollowed = await ProfileService.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount += 1;

        this.followings = [...this.followings, profileThatFollowed];
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem following user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.loading = true;
    try {
      await ProfileService.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount -= 1;
        this.followings = this.followings.filter(
          x => x.username !== this.rootStore.userStore.user!.username
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem unfollowing user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await ProfileService.listFollowings(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem loading followings');
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
