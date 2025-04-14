import { LoginRequest, PagedStatusItemRequest, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { instance, mock, verify, spy, when } from "@typestrong/ts-mockito";
import { ServerFacade } from "../../src/network/ServerFacade";

console.log = jest.fn();

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let serverFacade: ServerFacade;
  let loggedInUser: User;
  let authToken: any;
  const postString = "hello world";
  const mockUser = new User(
    "Tom",
    "Brady",
    "@therealking",
    "https://tads-tweeter.s3.us-east-1.amazonaws.com/images/@therealking.jpeg"
  );
  const loginRequest: LoginRequest = {
    alias: "@therealking",
    password: "therealking",
  };

  beforeEach(async () => {
    serverFacade = new ServerFacade();
    [loggedInUser, authToken] = await serverFacade.login(loginRequest);

    mockPostStatusView = mock<PostStatusView>();
    when(mockPostStatusView.getAuthToken()).thenReturn(authToken);
    when(mockPostStatusView.getCurrentUser()).thenReturn(loggedInUser);
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const PostStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(PostStatusPresenterSpy);
  });

  it("submit post, check for success message and successful story post", async () => {
    await postStatusPresenter.submitPost(postString);
    const storyRequest: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: "@therealking",
      pageSize: 10,
      lastItem: null,
    };
    const [statuses, hasMore] = await serverFacade.getMoreStories(storyRequest);
    expect(statuses[0].post).toEqual(postString);
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });
});
