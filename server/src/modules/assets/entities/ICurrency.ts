export interface ICurrency {
  id: string;
  user_id: string;
  name: string;
}

export interface ICreateCurrencyInput {
  name: string;
}

export interface ICreateCurrencyData {
  user_id: string;
  name: string;
}
