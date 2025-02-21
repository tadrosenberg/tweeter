import { AuthToken, Status } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
  addItems(newItems: Status[]): void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  public constructor(view: StatusItemView) {
    super(view);
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(lastItem: Status | null) {
    this._lastItem = lastItem;
  }

  protected set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
