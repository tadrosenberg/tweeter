import { AuthToken, User } from "tweeter-shared";
import useInfoHook from "./UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

interface NavigationHook {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
  extractAlias: (value: string) => string;
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
}

const useNavigationHook = (): NavigationHook => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useInfoHook();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    getCurrentUser: () => currentUser,
    getAuthToken: () => authToken,
    displayErrorMessage,
  };

  const presenter = new UserNavigationPresenter(listener);

  return {
    navigateToUser: presenter.navigateToUser.bind(presenter),
    extractAlias: presenter.extractAlias.bind(presenter),
    getUser: presenter.getUser.bind(presenter),
  };
};

export default useNavigationHook;
