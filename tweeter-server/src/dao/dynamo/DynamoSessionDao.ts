import { ISessionDao, AuthRecord } from "../interfaces/ISessionDao";
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

const TABLE_NAME = "auth";

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export class DynamoSessionDao implements ISessionDao {
  async createAuthToken(
    userAlias: string,
    token: string,
    timestamp: number
  ): Promise<string> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        userAlias,
        token,
        timestamp,
      },
    };
    const putResult = await docClient.send(new PutCommand(params));
    return token;
  }
  async getAuthToken(token: string): Promise<boolean> {
    const getParams = {
      TableName: TABLE_NAME,
      Key: { token },
    };

    const result = await docClient.send(new GetCommand(getParams));

    if (!result.Item) {
      console.warn("[getAuthToken] No token record found for token:", token);
      return false;
    }

    const record = result.Item as { timestamp: number };
    const storedTimestamp = record.timestamp;
    const now = Date.now();
    const tokenValidityWindow = 3 * 60 * 60 * 1000;

    if (now - storedTimestamp < tokenValidityWindow) {
      console.log("[getAuthToken] Token is valid.");
      return true;
    } else {
      console.warn("[getAuthToken] Token has expired.");
      await this.deleteAuthToken(token);
      return false;
    }
  }
  async deleteAuthToken(token: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: { token },
    };

    try {
      await docClient.send(new DeleteCommand(params));
      console.log("[deleteAuthToken] Successfully deleted token:", token);
    } catch (error) {
      console.error("[deleteAuthToken] Error deleting auth token:", error);
      throw error;
    }
  }

  async getUserfromToken(token: string): Promise<string> {
    const getParams = {
      TableName: TABLE_NAME,
      Key: { token },
    };

    try {
      const result = await docClient.send(new GetCommand(getParams));
      console.log("[getUserfromToken] GetCommand result:", result);

      if (result.Item) {
        const record = result.Item as { userAlias: string };
        if (record.userAlias) {
          return record.userAlias;
        } else {
          throw new Error("Token found but no userAlias field exists");
        }
      } else {
        throw new Error("Token not found");
      }
    } catch (error) {
      console.error("[getUserfromToken] Error:", error);
      throw error;
    }
  }
}
