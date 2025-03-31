import { StatusDto } from "tweeter-shared";

export interface IStatusDao {
  getPageOfStories(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  getPageOfFeeds(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  postStatus(token: string, newStatus: StatusDto): Promise<void>;
}
