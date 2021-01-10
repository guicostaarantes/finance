export interface ICurrencyValue {
  id: string;
  snapshotId: string;
  currencyId: string;
  value: number;
}

export interface ICreateCurrencyValueInput {
  value: number;
}

export interface ICreateCurrencyValueData {
  snapshotId: string;
  currencyId: string;
  value: number;
}
