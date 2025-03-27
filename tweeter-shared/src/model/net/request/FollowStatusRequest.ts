import { UserDto } from "../../dto/UserDto";
import { FollowRequest } from "./FollowRequest";

export interface FollowStatusRequest extends FollowRequest {
  readonly selectedUser: UserDto;
}
