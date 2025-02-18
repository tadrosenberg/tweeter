import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LogoutView {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
  displayErrorMessage: (message: string) => void;
  getAuthToken: () => AuthToken | null;
}

export class LogoutPresenter {
  private view: LogoutView;
  private service: UserService;

  public constructor(view: LogoutView) {
    this.view = view;
    this.service = new UserService();
  }

  logOut = async () => {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(this.view.getAuthToken()!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };
}
