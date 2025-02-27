import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading(isLoading: boolean): void;
  setPost(post: string): void;
  getAuthToken(): AuthToken | null;
  getCurrentUser(): User | null;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();
  }

  public get statusService(): StatusService {
    return this.service;
  }

  public async submitPost(post: string): Promise<void> {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, this.view.getCurrentUser()!, Date.now());

      await this.statusService.postStatus(this.view.getAuthToken()!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
