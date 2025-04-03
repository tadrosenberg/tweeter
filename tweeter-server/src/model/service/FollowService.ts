import { User, UserDto } from "tweeter-shared";
import { IUserDao } from "../../dao/interfaces/IUserDao";
import { ISessionDao } from "../../dao/interfaces/ISessionDao";
import { IFollowDao } from "../../dao/interfaces/IFollowDao";

export class FollowService {
  private userDao: IUserDao;
  private sessionDao: ISessionDao;
  private followDao: IFollowDao;

  constructor(
    userDao: IUserDao,
    sessionDao: ISessionDao,
    followDao: IFollowDao
  ) {
    this.userDao = userDao;
    this.sessionDao = sessionDao;
    this.followDao = followDao;
  }
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }
    const [items, hasMore] = await this.followDao.getPageOfFollowers(
      userAlias,
      pageSize,
      User.fromDto(lastItem)
    );
    const userPromises = items.map((userAlias) =>
      this.userDao.getUser(userAlias)
    );
    const userDtosOrNull = await Promise.all(userPromises);
    const userDtos = userDtosOrNull.filter(
      (dto): dto is UserDto => dto !== null
    );

    return [userDtos, hasMore];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }
    const [items, hasMore] = await this.followDao.getPageOfFollowees(
      userAlias,
      pageSize,
      User.fromDto(lastItem)
    );
    const userPromises = items.map((userAlias) =>
      this.userDao.getUser(userAlias)
    );
    const userDtosOrNull = await Promise.all(userPromises);
    const userDtos = userDtosOrNull.filter(
      (dto): dto is UserDto => dto !== null
    );

    return [userDtos, hasMore];
  }

  follow = async (
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> => {
    const currentUser = await this.sessionDao.getUserfromToken(token);
    if (currentUser === null) {
      throw new Error("[Bad Request] User not found");
    }

    await this.followDao.follow(currentUser, userToFollow.alias);

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  };

  unfollow = async (
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> => {
    const currentUser = await this.sessionDao.getUserfromToken(token);
    if (currentUser === null) {
      throw new Error("[Bad Request] User not found");
    }

    await this.followDao.unfollow(currentUser, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  };

  getFolloweeCount = async (token: string, user: UserDto): Promise<number> => {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }
    return await this.followDao.getFolloweeCount(user.alias);
  };

  getFollowerCount = async (token: string, user: UserDto): Promise<number> => {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }
    return this.followDao.getFollowerCount(user.alias);
  };

  getIsFollowerStatus = async (
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> => {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }
    return await this.followDao.getFollowStatus(user.alias, selectedUser.alias);
  };
}
