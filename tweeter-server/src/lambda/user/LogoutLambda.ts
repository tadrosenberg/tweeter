import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const imageDao = daoFactory.createImageDao();

  const userService = new UserService(userDao, sessionDao, imageDao);
  const response = await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
