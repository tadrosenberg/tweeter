import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface RegisterView {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  navigate: (url: string) => void;
}

export class RegisterPresenter {
  private _view: RegisterView;
  private userService: UserService;

  public constructor(view: RegisterView) {
    this._view = view;
    this.userService = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this._view.updateUserInfo(user, user, authToken, rememberMe);
      this._view.navigate("/");
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }
}
