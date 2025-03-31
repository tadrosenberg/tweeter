import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  // Create the concrete factory instance
  const daoFactory = new DynamoDaoFactory();

  // Use the factory to create DAO instances
  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();

  // Inject the DAOs into the UserService
  const userService = new UserService(userDao, sessionDao);
  const user = await userService.getUser(request.token, request.alias);
  return {
    success: true,
    message: null,
    user: user,
  };
};
