import { IImageDao } from "../interfaces/IImageDao";

export class DynamoImageDao implements IImageDao {
  uploadProfileImage(
    userAlias: string,
    imageBuffer: Buffer,
    fileType: string
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getImageUrl(userAlias: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
