import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  getAuthToken: () => AuthToken | null;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private service: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this.service = new UserService();
  }

  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.service.logout(this.view.getAuthToken()!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
