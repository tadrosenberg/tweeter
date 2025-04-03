import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
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
  const response = await statusService.postStatus(
    request.token,
    request.status
  );

  return {
    success: true,
    message: null,
  };
};
