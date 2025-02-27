import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useInfoHook from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthView } from "../../../presenter/Presenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useInfoHook();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean =>
    presenter.checkSubmitButtonStatus(alias, password);

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const listener: AuthView = {
    setIsLoading: setIsLoading,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };

  const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));

  const doLogin = async () => {
    presenter.doLogin(alias, password, rememberMe, props.originalUrl || "");
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields
        alias={alias}
        setAlias={setAlias}
        password={password}
        setPassword={setPassword}
        actionOnEnter={loginOnEnter}
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
