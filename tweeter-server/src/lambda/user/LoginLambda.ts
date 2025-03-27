import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const userService = new UserService();
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
