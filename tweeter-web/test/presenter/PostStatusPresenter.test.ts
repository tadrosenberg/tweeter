import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;
  const testUser = new User("firstName", "lastName", "alias", "imageUrl");
  const postMessage = "Hello, world!";
  const testAuthToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const postStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(postStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );
    when(mockPostStatusView.getAuthToken()).thenReturn(testAuthToken);
  });

  it("presenter tells the view to display a posting message", async () => {
    await postStatusPresenter.submitPost("Hello, world!");
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("presenter calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost("Hello, world!");

    let [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();
    console.log(capturedAuthToken);
    console.log(capturedStatus);

    expect(capturedAuthToken).toEqual(testAuthToken);
    expect(capturedStatus.post).toEqual(postMessage);

    verify(mockStatusService.postStatus(anything(), anything())).once();
  });

  it("presenter tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost("Hello, world!");

    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("presenter displays an error message and clears last info message, doesn't clear post or display status posted message", async () => {
    const error = new Error("An error occured");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost("Hello, world!");

    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: An error occured"
      )
    );

    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
    verify(mockPostStatusView.setPost("")).never();
  });
});
