import { UserCountRequest, UserCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: UserCountRequest
): Promise<UserCountResponse> => {
  const followService = new FollowService();
  const count = await followService.getFolloweeCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: count,
  };
};
