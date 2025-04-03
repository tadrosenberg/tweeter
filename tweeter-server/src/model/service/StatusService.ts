import {
  AuthToken,
  FakeData,
  Status,
  StatusDto,
  UserDto,
} from "tweeter-shared";
import { IUserDao } from "../../dao/interfaces/IUserDao";
import { ISessionDao } from "../../dao/interfaces/ISessionDao";
import { IFollowDao } from "../../dao/interfaces/IFollowDao";
import { IStatusDao } from "../../dao/interfaces/IStatusDao";

export class StatusService {
  private userDao: IUserDao;
  private sessionDao: ISessionDao;
  private followDao: IFollowDao;
  private statusDao: IStatusDao;

  constructor(
    userDao: IUserDao,
    sessionDao: ISessionDao,
    followDao: IFollowDao,
    statusDao: IStatusDao
  ) {
    this.userDao = userDao;
    this.sessionDao = sessionDao;
    this.followDao = followDao;
    this.statusDao = statusDao;
  }
  loadMoreStoryItems = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }
    const lastTimestamp = lastItem ? lastItem.timestamp : undefined;
    const [partialStatuses, hasMore] = await this.statusDao.getPageOfStories(
      userAlias,
      pageSize,
      lastTimestamp
    );

    const enrichedStatuses: StatusDto[] = await Promise.all(
      partialStatuses.map(async (status) => {
        const fullUser: UserDto | null = await this.userDao.getUser(
          status.user.alias
        );
        return {
          ...status,
          user: fullUser || status.user,
        };
      })
    );

    return [enrichedStatuses, hasMore];
  };

  loadMoreFeedItems = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }
    const lastCompositeKey = lastItem
      ? `${lastItem.timestamp}#${lastItem.user.alias}`
      : undefined;
    const [partialStatuses, hasMore] = await this.statusDao.getPageOfFeeds(
      userAlias,
      pageSize,
      lastCompositeKey
    );

    const enrichedStatuses: StatusDto[] = await Promise.all(
      partialStatuses.map(async (status) => {
        const fullUser: UserDto | null = await this.userDao.getUser(
          status.user.alias
        );
        return {
          ...status,
          user: fullUser || status.user,
        };
      })
    );

    return [enrichedStatuses, hasMore];
  };

  async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    if ((await this.sessionDao.getAuthToken(token)) === false) {
      throw new Error("[Bad Request] Invalid token");
    }

    await this.statusDao.postStatus(newStatus);

    const followers: string[] = await this.followDao.getFollowers(
      newStatus.user.alias
    );
    console.log(
      "[postStatus] Followers for user",
      newStatus.user.alias,
      ":",
      followers
    );

    await this.statusDao.batchInsertFeedItems(followers, newStatus);
  }
}
