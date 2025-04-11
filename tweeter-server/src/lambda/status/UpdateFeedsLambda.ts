import { StatusDto } from "tweeter-shared";
import { DynamoStatusDao } from "../../dao/dynamo/DynamoStatusDao";
import { DynamoUserDao } from "../../dao/dynamo/DynamoUserDao";

export const handler = async (event: any) => {
  const statusDao = new DynamoStatusDao();
  const userDao = new DynamoUserDao();

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      console.log("Processing update feed message:", message);

      const followers: string[] = message.followers;
      const user = await userDao.getUser(message.userAlias);
      if (!user) {
        throw new Error(`User not found for alias: ${message.userAlias}`);
      }
      const newStatus: StatusDto = {
        post: message.post,
        timestamp: message.timestamp,
        user: user,
      };

      await statusDao.batchInsertFeedItems(followers, newStatus);
      console.log("Feed updated for followers:", followers);
    } catch (error) {
      console.error("Error processing update feed message:", error);
      throw error;
    }
  }
};
