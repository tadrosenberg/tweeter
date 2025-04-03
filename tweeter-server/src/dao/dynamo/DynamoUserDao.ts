import { UserDto } from "tweeter-shared";
import { IUserDao, UserRecord } from "../interfaces/IUserDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = "user";

export class DynamoUserDao implements IUserDao {
  async login(alias: string, password: string): Promise<UserDto> {
    const getParams = {
      TableName: TABLE_NAME,
      Key: { alias },
    };
    const result = await docClient.send(new GetCommand(getParams));

    if (!result.Item) {
      throw new Error("[Bad Request] Username or password is incorrect");
    }

    const user = result.Item as UserRecord;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("[Bad Request] Invalid password");
    }

    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async getUser(alias: string): Promise<UserDto | null> {
    console.log(`[getUser] Looking for alias: ${alias}`);

    const getParams = {
      TableName: TABLE_NAME,
      Key: { alias: alias },
    };
    const result = await docClient.send(new GetCommand(getParams));
    console.log("[getUser] DynamoDB returned:", result);

    if (!result.Item) {
      return null;
    } else {
      const user = result.Item as UserRecord;
      const { passwordHash, ...sanitizedUser } = user;
      return sanitizedUser;
    }
  }

  async createUser(user: UserDto, password: string): Promise<UserDto> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRecord: UserRecord = {
      ...user,
      passwordHash: hashedPassword,
    };

    const params = {
      TableName: TABLE_NAME,
      Item: userRecord,
    };

    const putResult = await docClient.send(new PutCommand(params));
    const { passwordHash, ...sanitizedUser } = userRecord;
    return sanitizedUser;
  }
}
