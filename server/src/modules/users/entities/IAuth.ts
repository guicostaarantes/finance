export interface IAuthenticateUserInput {
  email: string;
  password: string;
}

export interface IAuthenticateUserData {
  user_id: string;
  token: string;
  created_at: number;
  expires_at: number;
}
