import { UserDto } from "tweeter-shared";

export interface IFollowDao {
  getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[string[], boolean]>;
  getPageOfFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[string[], boolean]>;
  follow(currentUser: string, userToFollow: string): Promise<void>;
  unfollow(currentUser: string, userToUnfollow: string): Promise<void>;
  getFollowerCount(userAlias: string): Promise<number>;
  getFolloweeCount(userAlias: string): Promise<number>;
  getFollowStatus(user: string, selectedUser: string): Promise<boolean>;
  getFollowers(userAlias: string): Promise<string[]>;
}
