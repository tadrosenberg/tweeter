import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { IUserDao } from "../../dao/interfaces/IUserDao";
import { ISessionDao } from "../../dao/interfaces/ISessionDao";

export class UserService {
  private userDao: IUserDao;
  private sessionDao: ISessionDao;

  constructor(userDao: IUserDao, sessionDao: ISessionDao) {
    this.userDao = userDao;
    this.sessionDao = sessionDao;
  }

  login = async (
    alias: string,
    password: string
  ): Promise<[UserDto, string]> => {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.token];
  };

  register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> => {
    //create a new user
    //get
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.token];
  };

  getUser = async (token: string, alias: string): Promise<UserDto | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias)?.dto ?? null;
  };

  logout = async (token: string): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
