import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoFollowDao } from "../../dao/dynamo/DynamoFollowDao";

const sqsClient = new SQSClient({ region: "us-east-1" });
const updateFeedsQueueUrl =
  "https://sqs.us-east-1.amazonaws.com/293404919967/UpdateFeedsQueue";

export const handler = async (event: any) => {
  const followDao = new DynamoFollowDao();

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body);
      console.log("Received message:", message);

      const followers: string[] = await followDao.getFollowers(
        message.userAlias
      );
      console.log(
        `Found ${followers.length} followers for ${message.userAlias}`
      );

      const batchSize = 25;
      for (let i = 0; i < followers.length; i += batchSize) {
        const batch = followers.slice(i, i + batchSize);
        const updateMessage = {
          followers: batch,
          userAlias: message.userAlias,
          timestamp: message.timestamp,
          post: message.post,
        };

        const params = {
          QueueUrl: updateFeedsQueueUrl,
          MessageBody: JSON.stringify(updateMessage),
        };

        await sqsClient.send(new SendMessageCommand(params));
        console.log("Sent update message for batch:", batch);
      }
    } catch (error) {
      console.error("Error processing a record:", error);
      throw error;
    }
  }
};
