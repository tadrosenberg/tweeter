import { UserService } from "../model/service/UserService";
import { AuthPresenter } from "./AuthPresenter";
import { AuthView } from "./Presenter";

export class RegisterPresenter extends AuthPresenter<AuthView> {
  private userService: UserService;

  public constructor(view: AuthView) {
    super(view);
    this.userService = new UserService();
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
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
    await this.executeUserAction(
      () =>
        this.userService.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        ),
      rememberMe,
      "register user"
    );
  }
}
