import { UserCountRequest, UserCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: UserCountRequest
): Promise<UserCountResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const followDao = daoFactory.createFollowDao();

  const followService = new FollowService(userDao, sessionDao, followDao);
  const count = await followService.getFolloweeCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: count,
  };
};
