import { StatusDto } from "tweeter-shared";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const STORY_TABLE = "story";
const FEED_TABLE = "feed";

export class DynamoStatusDao {
  async postStatus(newStatus: StatusDto): Promise<void> {
    const storyItem = {
      senderAlias: newStatus.user.alias,
      timestamp: newStatus.timestamp,
      post: newStatus.post,
    };

    const params = {
      TableName: STORY_TABLE,
      Item: storyItem,
    };

    try {
      await docClient.send(new PutCommand(params));
      console.log("[postStatus] Successfully inserted story item:", storyItem);
    } catch (error) {
      console.error("[postStatus] Error inserting story item:", error);
      throw error;
    }
  }

  async getPageOfStories(
    userAlias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<[StatusDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: STORY_TABLE,
      KeyConditionExpression: "senderAlias = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false,
    };

    if (lastTimestamp) {
      params.ExclusiveStartKey = {
        senderAlias: userAlias,
        timestamp: lastTimestamp,
      };
    }

    const result = await docClient.send(new QueryCommand(params));
    console.log("[getPageOfStories] Query result:", result);

    const stories: StatusDto[] =
      result.Items?.map((item) => ({
        post: item.post,
        user: { alias: item.senderAlias } as any,
        timestamp: item.timestamp,
      })) || [];
    const hasMore = !!result.LastEvaluatedKey;
    return [stories, hasMore];
  }
  async getPageOfFeeds(
    userAlias: string,
    pageSize: number,
    lastCompositeKey?: string
  ): Promise<[StatusDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: FEED_TABLE,
      KeyConditionExpression: "recieverAlias = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false,
    };

    if (lastCompositeKey) {
      params.ExclusiveStartKey = {
        recieverAlias: userAlias,
        dateUser: lastCompositeKey,
      };
    }

    try {
      const result = await docClient.send(new QueryCommand(params));
      console.log("[getPageOfFeeds] Query result:", result);

      const feeds: StatusDto[] =
        result.Items?.map((item) => {
          const composite: string = item.dateUser;
          const [timestampStr, senderAlias] = composite.split("#");
          const timestamp = parseInt(timestampStr, 10);
          return {
            post: item.post,
            user: { alias: senderAlias } as any,
            timestamp: timestamp,
          };
        }) || [];

      const hasMore = !!result.LastEvaluatedKey;
      return [feeds, hasMore];
    } catch (error) {
      console.error("[getPageOfFeeds] Error:", error);
      throw error;
    }
  }

  async batchInsertFeedItems(
    followers: string[],
    newStatus: StatusDto
  ): Promise<void> {
    // Construct composite sort key for the feed items.
    const compositeKey = `${newStatus.timestamp}#${newStatus.user.alias}`;

    // Create a PutRequest for each follower.
    const items = followers.map((followerAlias) => ({
      PutRequest: {
        Item: {
          recieverAlias: followerAlias, // Partition key in Feed table
          dateUser: compositeKey, // Composite sort key
          post: newStatus.post,
        },
      },
    }));

    // BatchWrite can handle a maximum of 25 items per batch.
    const maxBatchSize = 25;
    for (let i = 0; i < items.length; i += maxBatchSize) {
      const batch = items.slice(i, i + maxBatchSize);
      const params: BatchWriteCommandInput = {
        RequestItems: {
          [FEED_TABLE]: batch,
        },
      };

      try {
        const result = await docClient.send(new BatchWriteCommand(params));
        console.log("[batchInsertFeedItems] Batch write result:", result);
        // Optionally handle UnprocessedItems here.
      } catch (error) {
        console.error(
          "[batchInsertFeedItems] Error during batch write:",
          error
        );
        throw error;
      }
    }
  }
}
