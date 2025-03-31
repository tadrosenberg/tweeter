import { IFollowDao } from "../interfaces/IFollowDao";
import { IUserDao } from "../interfaces/IUserDao";
import { IDaoFactory } from "../interfaces/IDaoFactory";
import { IStatusDao } from "../interfaces/IStatusDao";
import { IImageDao } from "../interfaces/IImageDao";
import { DynamoUserDao } from "./DynamoUserDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { DynamoStatusDao } from "./DynamoStatusDao";
import { DynamoImageDao } from "./DynamoImageDao";
import { ISessionDao } from "../interfaces/ISessionDao";
import { DynamoSessionDao } from "./DynamoSessionDao";

export class DynamoDaoFactory implements IDaoFactory {
  createUserDao(): IUserDao {
    return new DynamoUserDao();
  }

  createFollowDao(): IFollowDao {
    return new DynamoFollowDao();
  }

  createStatusDao(): IStatusDao {
    return new DynamoStatusDao();
  }

  createImageDao(): IImageDao {
    return new DynamoImageDao();
  }

  createSessionDao(): ISessionDao {
    return new DynamoSessionDao();
  }
}
