export interface IImageDao {
  uploadProfileImage(
    userAlias: string,
    imageStringBase64Encoded: string,
    imageFileExtension: string
  ): Promise<string>;
  getImageUrl(userAlias: string): Promise<string>;
}
