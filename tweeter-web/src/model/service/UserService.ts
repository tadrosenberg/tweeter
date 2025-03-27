import { Buffer } from "buffer";
import {
  AuthToken,
  FakeData,
  LoginRequest,
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
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  logout = async (authToken: AuthToken): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
