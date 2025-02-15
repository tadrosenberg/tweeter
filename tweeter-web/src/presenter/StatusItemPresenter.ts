import { AuthToken, Status } from "tweeter-shared";

export interface StatusItemView {
  addItems(newItems: Status[]): void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  public constructor(view: StatusItemView) {
    this._view = view;
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

  protected get view(): StatusItemView {
    return this._view;
  }

  protected set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
