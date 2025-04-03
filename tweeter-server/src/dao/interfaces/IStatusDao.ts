import { StatusDto } from "tweeter-shared";

export interface IStatusDao {
  getPageOfStories(
    userAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<[StatusDto[], boolean]>;
  getPageOfFeeds(
    userAlias: string,
    pageSize: number,
    lastCompositeKey?: string
  ): Promise<[StatusDto[], boolean]>;
  postStatus(newStatus: StatusDto): Promise<void>;
  batchInsertFeedItems(
    followers: string[],
    newStatus: StatusDto
  ): Promise<void>;
}
