import { UserDto } from "tweeter-shared";

export interface IUserDao {
  getUser(alias: string): Promise<UserDto | null>;
  createUser(user: UserDto): Promise<[UserDto, string]>;
}
