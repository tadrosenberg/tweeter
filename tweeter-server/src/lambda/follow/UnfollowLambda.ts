import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: FollowRequest
): Promise<FollowResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const followDao = daoFactory.createFollowDao();

  const followService = new FollowService(userDao, sessionDao, followDao);
  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
