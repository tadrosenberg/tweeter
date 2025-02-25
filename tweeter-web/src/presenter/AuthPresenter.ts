import { AuthToken, User } from "tweeter-shared";
import { AuthView, Presenter } from "./Presenter";

export class AuthPresenter<V extends AuthView> extends Presenter<V> {
  public async executeUserAction(
    action: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl?: string,
    operationDescription: string = "perform user action"
  ): Promise<void> {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await action();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(originalUrl ? originalUrl : "/");
    }, operationDescription);

    this.view.setIsLoading(false);
  }
}
