import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const userService = new UserService();
  const [user, token] = await userService.register(
    request.alias,
    request.password,
    request.firstName,
    request.lastName,
    request.userImageBytes,
    request.imageFileExtension
  );
  return {
    success: true,
    message: null,
    user: user,
    token: token,
  };
};
