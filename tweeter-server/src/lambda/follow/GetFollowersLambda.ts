import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const followDao = daoFactory.createFollowDao();

  const followService = new FollowService(userDao, sessionDao, followDao);
  const [items, hasMore] = await followService.loadMoreFollowers(
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
