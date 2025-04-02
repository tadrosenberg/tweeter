import { IImageDao } from "../interfaces/IImageDao";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ObjectCannedACL } from "@aws-sdk/client-s3"; // For ACL settings

const BUCKET = "tads-tweeter";
const REGION = "us-east-1";

export class DynamoImageDao implements IImageDao {
  async uploadProfileImage(
    userAlias: string,
    imageStringBase64Encoded: string,
    imageFileExtension: string
  ): Promise<string> {
    const fileName = `${userAlias}.${imageFileExtension}`;

    const decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );

    let contentType = "image/png";
    if (
      imageFileExtension.toLowerCase() === "jpg" ||
      imageFileExtension.toLowerCase() === "jpeg"
    ) {
      contentType = "image/jpeg";
    }

    const s3Params = {
      Bucket: BUCKET,
      Key: "images/" + fileName,
      Body: decodedImageBuffer,
      ContentType: contentType,
      ACL: ObjectCannedACL.public_read,
    };

    const client = new S3Client({ region: REGION });
    const command = new PutObjectCommand(s3Params);

    try {
      await client.send(command);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw new Error("s3 put image failed with: " + error);
    }
  }

  async getImageUrl(userAlias: string): Promise<string> {
    const fileName = `${userAlias}.png`;
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/images/${fileName}`;
  }
}
