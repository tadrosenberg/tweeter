import { IFollowDao } from "./IFollowDao";
import { IImageDao } from "./IImageDao";
import { IStatusDao } from "./IStatusDao";
import { IUserDao } from "./IUserDao";

export interface IDaoFactory {
  createUserDao(): IUserDao;
  createFollowDao(): IFollowDao;
  createStatusDao(): IStatusDao;
  createImageDao(): IImageDao;
}
