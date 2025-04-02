import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const imageDao = daoFactory.createImageDao();

  const userService = new UserService(userDao, sessionDao, imageDao);
  const [user, token] = await userService.login(
    request.alias,
    request.password
  );
  return {
    success: true,
    message: null,
    user: user,
    token: token,
  };
};
