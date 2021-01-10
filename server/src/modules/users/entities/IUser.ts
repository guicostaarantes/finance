export interface IUser {
  id: string;
  email: string;
  password: string;
  createdAt: number;
}

export interface ICreateUserInput {
  email: string;
  password: string;
}

export interface ICreateUserData {
  email: string;
  password: string;
  createdAt: number;
}
