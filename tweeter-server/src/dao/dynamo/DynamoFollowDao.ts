import { UserDto } from "tweeter-shared";
import { IFollowDao } from "../interfaces/IFollowDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = "follow";

export class DynamoFollowDao implements IFollowDao {
  async getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[string[], boolean]> {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: "followeeAlias-index",
      KeyConditionExpression: "followeeAlias = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
      ...(lastItem && {
        ExclusiveStartKey: {
          followeeAlias: userAlias,
          followerAlias: lastItem.alias,
        },
      }),
    };

    const result = await docClient.send(new QueryCommand(params));
    const aliases: string[] =
      result.Items?.map((item) => item.followerAlias) || [];

    const hasMore = !!result.LastEvaluatedKey;

    return [aliases, hasMore];
  }
  async getPageOfFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[string[], boolean]> {
    const lastAlias = lastItem ? lastItem.alias : null;
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "followerAlias = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
      ...(lastAlias && {
        ExclusiveStartKey: {
          followerAlias: userAlias,
          followeeAlias: lastAlias,
        },
      }),
    };
    const result = await docClient.send(new QueryCommand(params));
    const aliases: string[] =
      result.Items?.map((item) => item.followeeAlias) || [];

    const hasMore = !!result.LastEvaluatedKey;

    return [aliases, hasMore];
  }
  async follow(currentUser: string, userToFollow: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        followerAlias: currentUser,
        followeeAlias: userToFollow,
      },
    };

    try {
      await docClient.send(new PutCommand(params));
      console.log(`[follow] ${currentUser} now follows ${userToFollow}`);
    } catch (error) {
      console.error(`[follow] Error adding follow relationship:`, error);
      throw error;
    }
  }
  async unfollow(currentUser: string, userToUnfollow: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        followerAlias: currentUser,
        followeeAlias: userToUnfollow,
      },
    };

    try {
      await docClient.send(new DeleteCommand(params));
      console.log(`[unfollow] ${currentUser} unfollowed ${userToUnfollow}`);
    } catch (error) {
      console.error(`[unfollow] Error deleting follow relationship:`, error);
      throw error;
    }
  }
  async getFollowerCount(userAlias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: "followeeAlias-index",
      KeyConditionExpression: "followeeAlias = :userAlias",
      ExpressionAttributeValues: {
        ":userAlias": userAlias,
      },
      Select: "COUNT",
    };

    try {
      const result = await docClient.send(new QueryCommand(params));
      console.log("[getFollowerCount] Query result:", result);
      return result.Count || 0;
    } catch (error) {
      console.error("[getFollowerCount] Error:", error);
      throw error;
    }
  }
  async getFolloweeCount(userAlias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "followerAlias = :userAlias",
      ExpressionAttributeValues: {
        ":userAlias": userAlias,
      },
      Select: "COUNT",
    };

    try {
      const result = await docClient.send(new QueryCommand(params));
      console.log("[getFolloweeCount] Query result:", result);
      return result.Count || 0;
    } catch (error) {
      console.error("[getFolloweeCount] Error:", error);
      throw error;
    }
  }
  async getFollowStatus(user: string, selectedUser: string): Promise<boolean> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        followerAlias: user,
        followeeAlias: selectedUser,
      },
    };

    try {
      const result = await docClient.send(new GetCommand(params));
      console.log("[getFollowStatus] Query result:", result);
      return !!result.Item;
    } catch (error) {
      console.error("[getFollowStatus] Error retrieving follow status:", error);
      throw error;
    }
  }
  async getFollowers(userAlias: string): Promise<string[]> {
    const aliases: string[] = [];
    let lastEvaluatedKey: any = undefined;

    do {
      const params: QueryCommandInput = {
        TableName: TABLE_NAME,
        IndexName: "followeeAlias-index",
        KeyConditionExpression: "followeeAlias = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        ExclusiveStartKey: lastEvaluatedKey,
      };

      try {
        const result = await docClient.send(new QueryCommand(params));
        if (result.Items) {
          for (const item of result.Items) {
            if (item.followerAlias) {
              aliases.push(item.followerAlias);
            }
          }
        }
        lastEvaluatedKey = result.LastEvaluatedKey;
      } catch (error) {
        console.error("[getFollowers] Error retrieving followers:", error);
        throw error;
      }
    } while (lastEvaluatedKey);

    return aliases;
  }
}
