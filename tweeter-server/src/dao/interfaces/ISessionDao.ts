export interface ISessionDao {
  createAuthToken(
    userAlias: string,
    token: string,
    timestamp: number
  ): Promise<string>;
  getAuthToken(token: string): Promise<boolean>;
  deleteAuthToken(sessionId: string): Promise<void>;
  getUserfromToken(token: string): Promise<string>;
}

export interface AuthRecord {
  userAlias: string;
  token: string;
  timestamp: number;
}
