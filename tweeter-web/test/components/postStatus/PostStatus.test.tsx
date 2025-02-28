import { render, screen } from "@testing-library/react";
import React from "react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import useInfoHook from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus", () => {
  beforeAll(() => {
    const mockUserInstance = new User(
      "firstName",
      "lastName",
      "alias",
      "imageUrl"
    );
    const mockAuthTokenInstance = new AuthToken("mockTokenValue", Date.now());

    (useInfoHook as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("When first rendered the Post Status and Clear buttons are both disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text", async () => {
    const { postStatusButton, clearButton, postStatusTextArea, user } =
      renderPostStatusAndGetElements();
    await user.type(postStatusTextArea, "Post text");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared", async () => {
    const { postStatusButton, clearButton, postStatusTextArea, user } =
      renderPostStatusAndGetElements();
    await user.type(postStatusTextArea, "Post text");
    await user.clear(postStatusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const post = "Post text";
    const { postStatusButton, postStatusTextArea, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);
    await user.type(postStatusTextArea, post);
    await user.click(postStatusButton);
    verify(mockPresenter.submitPost(post)).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);
  const postStatusButton = screen.getByLabelText("Post status");
  const clearButton = screen.getByLabelText("Clear");
  const postStatusTextArea = screen.getByLabelText("Post text");
  return { postStatusButton, clearButton, postStatusTextArea, user };
};
