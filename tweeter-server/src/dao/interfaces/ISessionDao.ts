export interface ISessionDao {
  createAuthToken(
    userAlias: string,
    token: string,
    timestamp: number
  ): Promise<string>;
  getAuthToken(token: string): Promise<boolean>;
  deleteAuthToken(sessionId: string): Promise<void>;
}

export interface AuthRecord {
  userAlias: string;
  token: string;
  timestamp: number;
}
