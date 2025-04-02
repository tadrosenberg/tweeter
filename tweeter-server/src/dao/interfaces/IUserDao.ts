import { UserDto } from "tweeter-shared";

export interface UserRecord extends UserDto {
  passwordHash: string;
}

export interface IUserDao {
  getUser(alias: string): Promise<UserDto | null>;
  createUser(user: UserDto, password: string): Promise<UserDto>;
  login(alias: string, password: string): Promise<UserDto>;
}
