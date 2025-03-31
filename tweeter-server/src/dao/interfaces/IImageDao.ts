export interface IImageDao {
  uploadProfileImage(
    userAlias: string,
    imageBuffer: Buffer,
    fileType: string
  ): Promise<string>;
  getImageUrl(userAlias: string): Promise<string>;
}
