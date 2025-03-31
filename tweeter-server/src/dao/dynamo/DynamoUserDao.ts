import { UserDto } from "tweeter-shared";
import { IUserDao } from "../interfaces/IUserDao";

export class DynamoUserDao implements IUserDao {
  getUser(alias: string): Promise<UserDto | null> {
    throw new Error("Method not implemented.");
  }
  createUser(user: UserDto): Promise<[UserDto, string]> {
    throw new Error("Method not implemented.");
  }
}
