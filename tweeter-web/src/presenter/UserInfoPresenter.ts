import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

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
    this.doFailureReportingOperation(async () => {
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
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers");
  }

  public async followDisplayedUser() {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {
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
    }, "follow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public async unfollowDisplayedUser() {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {
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
    }, "unfollow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public switchToLoggedInUser() {
    const currentUser = this.view.getCurrentUser();
    if (currentUser) {
      this.view.setDisplayedUser(currentUser);
    }
  }
}
