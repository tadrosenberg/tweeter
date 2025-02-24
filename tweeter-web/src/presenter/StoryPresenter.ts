import { AuthToken, Status } from "tweeter-shared";
import { PAGE_SIZE } from "./PagedItemPresenter";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(
      authToken!,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "load story";
  }
  public constructor(view: StatusItemView) {
    super(view);
  }
}
