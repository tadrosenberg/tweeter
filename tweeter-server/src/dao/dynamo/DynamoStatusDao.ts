import { StatusDto } from "tweeter-shared";
import { IStatusDao } from "../interfaces/IStatusDao";

export class DynamoStatusDao implements IStatusDao {
  getPageOfStories(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    throw new Error("Method not implemented.");
  }
  getPageOfFeeds(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    throw new Error("Method not implemented.");
  }
  postStatus(token: string, newStatus: StatusDto): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
