import { UserDto } from "tweeter-shared";

export interface IFollowDao {
  getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;
  getPageOfFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;
  follow(userToFollow: string): Promise<void>;
  unfollow(userToUnfollow: string): Promise<void>;
  getFollowerCount(userAlias: string): Promise<number>;
  getFolloweeCount(userAlias: string): Promise<number>;
  getFollowStatus(user: string, selectedUser: string): Promise<boolean>;
}
