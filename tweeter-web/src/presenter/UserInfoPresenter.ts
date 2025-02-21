import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";
import UserInfo from "../components/userInfo/UserInfo";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  getAuthToken: () => AuthToken | null;
  getCurrentUser: () => User | null;
  getDisplayedUser: () => User | null;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
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
          await this.service.getIsFollowerStatus(
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
        await this.service.getFolloweeCount(authToken, displayedUser)
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
        await this.service.getFollowerCount(authToken, displayedUser)
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

      const [followerCount, followeeCount] = await this.service.follow(
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

      const [followerCount, followeeCount] = await this.service.unfollow(
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
