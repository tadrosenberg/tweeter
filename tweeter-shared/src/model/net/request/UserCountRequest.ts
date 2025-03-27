import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface UserCountRequest extends TweeterRequest {
  readonly token: string;
  readonly user: UserDto;
}
