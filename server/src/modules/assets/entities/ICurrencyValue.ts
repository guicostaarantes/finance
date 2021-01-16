export interface ICurrencyValue {
  id: string;
  snapshotId: string;
  currencyId: string;
  price: number;
}

export interface ICreateCurrencyValueInput {
  price: number;
}

export interface ICreateCurrencyValueData {
  snapshotId: string;
  currencyId: string;
  price: number;
}
