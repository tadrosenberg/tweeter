import { UserDto } from "tweeter-shared";
import { IFollowDao } from "../interfaces/IFollowDao";

export class DynamoFollowDao implements IFollowDao {
  getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    throw new Error("Method not implemented.");
  }
  getPageOfFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    throw new Error("Method not implemented.");
  }
  follow(userToFollow: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  unfollow(userToUnfollow: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getFollowerCount(userAlias: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getFolloweeCount(userAlias: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getFollowStatus(user: string, selectedUser: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
