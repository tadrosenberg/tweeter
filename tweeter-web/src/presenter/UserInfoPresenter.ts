import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  displayErrorMessage: (message: string) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  displayInfoMessage: (message: string, timeout: number) => void;
  clearLastInfoMessage: () => void;
  getAuthToken: () => AuthToken | null;
  getCurrentUser: () => User | null;
  getDisplayedUser: () => User | null;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private userService: UserService;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async loadUserInfo() {
    const authToken = this.view.getAuthToken();
    const currentUser = this.view.getCurrentUser();
    const displayedUser = this.view.getDisplayedUser();
    if (!authToken || !currentUser || !displayedUser) return;

    await this.setIsFollowerStatus(authToken, currentUser, displayedUser);
    await this.setNumbFollowees(authToken, displayedUser);
    await this.setNumbFollowers(authToken, displayedUser);
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.userService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweeCount(
        await this.userService.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(
        await this.userService.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser() {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(
        `Following ${this.view.getDisplayedUser()!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.userService.follow(
        this.view.getAuthToken()!,
        this.view.getDisplayedUser()!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser() {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(
        `Unfollowing ${this.view.getDisplayedUser()!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.userService.unfollow(
        this.view.getAuthToken()!,
        this.view.getDisplayedUser()!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public switchToLoggedInUser() {
    const currentUser = this.view.getCurrentUser();
    if (currentUser) {
      this.view.setDisplayedUser(currentUser);
    }
  }
}
