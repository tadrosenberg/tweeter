import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems(newItems: T[]): void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<
  PagedItemView<T>
> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private _service: U;

  public constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): U;

  protected get service() {
    return this._service;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  protected set lastItem(lastItem: T | null) {
    this._lastItem = lastItem;
  }

  protected set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
