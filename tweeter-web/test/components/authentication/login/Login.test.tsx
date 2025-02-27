import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login", () => {
  it("start with sign in disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enabled when both the alias and password fields have text", async () => {
    const { signInButton, aliasInput, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasInput, "alias");
    await user.type(passwordField, "password");
    expect(signInButton).toBeEnabled();
  });

  it("disabled if either the alias or password field is cleared", async () => {
    const { signInButton, aliasInput, passwordField, user } =
      renderLoginAndGetElements("/");

    await user.type(aliasInput, "alias");
    await user.type(passwordField, "password");

    await user.clear(aliasInput);
    expect(signInButton).toBeDisabled();

    await user.type(aliasInput, "alias");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const originalUrl = "/originalUrl";
    const alias = "alias";
    const password = "password";
    const rememberMe = false;

    const { signInButton, aliasInput, passwordField, user } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);
    await user.type(aliasInput, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(
      mockPresenter.doLogin(alias, password, rememberMe, originalUrl)
    ).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenter);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasInput = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return {
    signInButton,
    aliasInput,
    passwordField,
    user,
  };
};
