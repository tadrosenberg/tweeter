import {
  AuthToken,
  FakeData,
  FollowRequest,
  PagedUserItemRequest,
  User,
  UserCountRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return await this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return await this.serverFacade.getMoreFollowees(request);
  }

  follow = async (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> => {
    const request: FollowRequest = {
      token: authToken.token,
      user: userToFollow.dto,
    };
    return await this.serverFacade.follow(request);
  };

  unfollow = async (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> => {
    const request: FollowRequest = {
      token: authToken.token,
      user: userToUnfollow.dto,
    };
    return await this.serverFacade.unfollow(request);
  };

  getFolloweeCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    const request: UserCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return await this.serverFacade.getFolloweeCount(request);
  };

  getFollowerCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    const request: UserCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return await this.serverFacade.getFollowerCount(request);
  };

  getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> => {
    const request = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };
    return await this.serverFacade.getIsFollowerStatus(request);
  };
}
