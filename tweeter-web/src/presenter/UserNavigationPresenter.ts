import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  getCurrentUser: () => User | null;
  getAuthToken: () => AuthToken | null;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    this._view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(
        this._view.getAuthToken()!,
        alias
      );

      if (!!user) {
        if (this._view.getCurrentUser()?.equals(user)) {
          this._view.setDisplayedUser(this._view.getCurrentUser()!);
        } else {
          this._view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(`Failed to get user: ${error}`);
    }
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }
}
