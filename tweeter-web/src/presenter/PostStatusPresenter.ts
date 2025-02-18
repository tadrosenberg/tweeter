import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setIsLoading(isLoading: boolean): void;
  setPost(post: string): void;
  displayInfoMessage(message: string, duration: number): void;
  displayErrorMessage(message: string): void;
  clearLastInfoMessage(): void;
  getAuthToken(): AuthToken | null;
  getCurrentUser(): User | null;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.statusService = new StatusService();
  }

  public async submitPost(post: string): Promise<void> {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, this.view.getCurrentUser()!, Date.now());

      await this.statusService.postStatus(this.view.getAuthToken()!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
