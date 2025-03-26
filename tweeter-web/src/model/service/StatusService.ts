import {
  AuthToken,
  PagedStatusItemRequest,
  PostStatusRequest,
  Status,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return await this.serverFacade.getMoreStories(request);
  };

  loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return await this.serverFacade.getMoreFeeds(request);
  };

  postStatus = async (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> => {
    const request: PostStatusRequest = {
      token: authToken.token,
      status: newStatus.dto,
    };
    return await this.serverFacade.postStatus(request);
  };
}
