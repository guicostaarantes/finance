export interface IAuthenticateUserInput {
  email: string;
  password: string;
}

export interface ISession {
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
}
