import { FollowStatusRequest, FollowStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: FollowStatusRequest
): Promise<FollowStatusResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const followDao = daoFactory.createFollowDao();

  const followService = new FollowService(userDao, sessionDao, followDao);
  const status = await followService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    status: status,
  };
};
