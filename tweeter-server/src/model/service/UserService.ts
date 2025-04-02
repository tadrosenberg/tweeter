import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { IUserDao } from "../../dao/interfaces/IUserDao";
import { ISessionDao } from "../../dao/interfaces/ISessionDao";
import { IImageDao } from "../../dao/interfaces/IImageDao";

export class UserService {
  private userDao: IUserDao;
  private sessionDao: ISessionDao;
  private imageDao: IImageDao;

  constructor(userDao: IUserDao, sessionDao: ISessionDao, imageDao: IImageDao) {
    this.userDao = userDao;
    this.sessionDao = sessionDao;
    this.imageDao = imageDao;
  }

  login = async (
    alias: string,
    password: string
  ): Promise<[UserDto, string]> => {
    const user = await this.userDao.login(alias, password);

    const token = AuthToken.Generate().token;
    const loggedToken = await this.sessionDao.createAuthToken(
      user.alias,
      token,
      Date.now()
    );

    return [user, loggedToken];
  };

  register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> => {
    //add the image and return the url
    const imageUrl = await this.imageDao.uploadProfileImage(
      alias,
      userImageBytes,
      imageFileExtension
    );
    console.log(
      "UserService.register params:",
      firstName,
      lastName,
      alias,
      password
    );
    const newUser: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl: imageUrl,
    };
    const user = await this.userDao.createUser(newUser, password);
    console.log("made user, now trying auth token");
    const token = AuthToken.Generate().token;
    const loggedToken = await this.sessionDao.createAuthToken(
      user.alias,
      token,
      Date.now()
    );
    console.log("made token");

    return [user, loggedToken];
  };

  getUser = async (token: string, alias: string): Promise<UserDto | null> => {
    //check authToken
    return this.userDao.getUser(alias) ?? null;
  };

  logout = async (token: string): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
