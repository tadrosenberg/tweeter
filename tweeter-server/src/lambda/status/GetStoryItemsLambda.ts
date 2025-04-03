import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const followDao = daoFactory.createFollowDao();
  const statusDao = daoFactory.createStatusDao();

  const statusService = new StatusService(
    userDao,
    sessionDao,
    followDao,
    statusDao
  );
  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
