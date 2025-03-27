import { Buffer } from "buffer";
import {
  AuthToken,
  GetUserRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  serverFacade = new ServerFacade();
  login = async (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> => {
    // TODO: Replace with the result of calling the server
    const request: LoginRequest = {
      alias: alias,
      password: password,
    };

    return await this.serverFacade.login(request);
  };

  register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> => {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };

    return await this.serverFacade.register(request);
  };

  getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    const request: GetUserRequest = {
      token: authToken.token,
      alias: alias,
    };
    return await this.serverFacade.getUser(request);
  };

  logout = async (authToken: AuthToken): Promise<void> => {
    const request: LogoutRequest = {
      token: authToken.token,
    };
    return await this.serverFacade.logout(request);
  };
}
