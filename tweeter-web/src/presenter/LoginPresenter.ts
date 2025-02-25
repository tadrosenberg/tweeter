import { UserService } from "../model/service/UserService";
import { AuthPresenter } from "./AuthPresenter";
import { AuthView } from "./Presenter";

export class LoginPresenter extends AuthPresenter<AuthView> {
  private userService: UserService;

  public constructor(view: AuthView) {
    super(view);
    this.userService = new UserService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string
  ) {
    await this.executeUserAction(
      () => this.userService.login(alias, password),
      rememberMe,
      originalUrl,
      "log user in"
    );
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }
}
