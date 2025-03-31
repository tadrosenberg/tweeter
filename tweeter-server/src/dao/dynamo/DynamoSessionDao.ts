import { ISessionDao } from "../interfaces/ISessionDao";

export class DynamoSessionDao implements ISessionDao {
  createAuthToken(
    userAlias: string,
    token: string,
    timestamp: number
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getAuthToken(token: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteAuthToken(sessionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
