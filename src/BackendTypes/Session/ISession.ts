export interface ISession {
  lastRequest: Date;
  principal: object;
  sessionId: string;
  sessionType: object;
  expiresAt: Date;
  expired: boolean;
}
