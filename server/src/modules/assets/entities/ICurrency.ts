export interface ICurrency {
  id: string;
  userId: string;
  name: string;
}

export interface ICreateCurrencyInput {
  name: string;
}

export interface ICreateCurrencyData {
  userId: string;
  name: string;
}
