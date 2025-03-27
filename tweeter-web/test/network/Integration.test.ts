import {
  AuthToken,
  PagedUserItemRequest,
  RegisterRequest,
  User,
  UserCountRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";
import { StatusService } from "../../src/model/service/StatusService";

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();

  const user = new User("John", "Doe", "johndoe", "image");
  const authToken = new AuthToken("token", Date.now());

  // Test for user registration
  test("Successfully register a new user", async () => {
    const request: RegisterRequest = {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      password: "password",
      userImageBytes: "image",
      imageFileExtension: "png",
    };
    const registerResponse = await serverFacade.register(request);

    expect(typeof registerResponse[0].alias).toBe("string");
    expect(typeof registerResponse[0].firstName).toBe("string");
    expect(typeof registerResponse[0].lastName).toBe("string");
    expect(typeof registerResponse[0].imageUrl).toBe("string");

    expect(registerResponse[1].token).toBeDefined();
  });

  test("Get folllower count", async () => {
    const request: UserCountRequest = {
      token: authToken.token,
      user: user.dto,
    };

    const followCountResponse = await serverFacade.getFollowerCount(request);

    expect(typeof followCountResponse).toBe("number");
  });

  test("Successfully get more followers", async () => {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: user.alias,
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    expect(hasMore).toBe(true);

    if (followers.length > 0) {
      const follower = followers[0];
      expect(follower.alias).toBeDefined();
      expect(follower.firstName).toBeDefined();
      expect(follower.lastName).toBeDefined();
      expect(follower.imageUrl).toBeDefined();
    }
  });
});

describe("Service Integration Tests", () => {
  let statusService = new StatusService();

  test("Successfully retrieve a user's story pages", async () => {
    const authToken = new AuthToken("token", Date.now());
    const userAlias = "johndoe";
    const pageSize = 10;
    const lastItem = null;

    const [stories, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );

    expect(Array.isArray(stories)).toBe(true);
    expect(typeof hasMore).toBe("boolean");

    if (stories.length > 0) {
      const firstStatus = stories[0];
      expect(firstStatus.user).toBeDefined();
      expect(firstStatus.timestamp).toBeDefined();
      expect(firstStatus.post).toBeDefined();
      expect(firstStatus.formattedDate).toBeDefined();
      expect(firstStatus.segments).toBeDefined();
    }
  });
});
