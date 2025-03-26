import { UserDto } from "../../dto/UserDto";

export interface FollowStatusRequest {
  readonly token: string;
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
