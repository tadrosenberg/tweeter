import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const imageDao = daoFactory.createImageDao();

  const userService = new UserService(userDao, sessionDao, imageDao);
  const user = await userService.getUser(request.token, request.alias);
  return {
    success: true,
    message: null,
    user: user,
  };
};
