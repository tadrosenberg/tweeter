import { UserDto } from "../../dto/UserDto";

export interface UserCountRequest {
  readonly token: string;
  readonly user: UserDto;
}
