import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dao/dynamo/DynamoDaoFactory";

export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const daoFactory = new DynamoDaoFactory();

  const userDao = daoFactory.createUserDao();
  const sessionDao = daoFactory.createSessionDao();
  const imageDao = daoFactory.createImageDao();

  const userService = new UserService(userDao, sessionDao, imageDao);
  console.log(
    "Calling userService.register with:",
    request.alias,
    request.firstName,
    request.lastName
  );
  const [user, token] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );
  console.log("Register successful. User:", user, "Token:", token);

  return {
    success: true,
    message: null,
    user: user,
    token: token,
  };
};
