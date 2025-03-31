import { IFollowDao } from "./IFollowDao";
import { IImageDao } from "./IImageDao";
import { IStatusDao } from "./IStatusDao";
import { IUserDao } from "./IUserDao";

export interface IDaoFactory {
  createUserDAO(): IUserDao;
  createFollowDAO(): IFollowDao;
  createStatusDAO(): IStatusDao;
  createImageDAO(): IImageDao;
}
